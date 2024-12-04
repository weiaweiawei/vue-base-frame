/**
 * 压缩png/jpg脚本
 * 会在img目录下生成tiny.json记录压缩过的图片信息，忽略即可
 *
 */

const glob = require('glob')
const path = require('path')
const fs = require('fs')
const https = require('https')
const URL = require('url').URL
const ora = require('ora')
const chalk = require('chalk')
const figures = require('figures')
const table = require('text-table')

const args = require('minimist')(process.argv.slice(2))

if (typeof args.folder !== 'string') {
  console.log(chalk.redBright('请先指定图片目录名 \n'))
  process.exit(1)
}

const entry = `./src`
const imgs = glob.sync(`${path.resolve(__dirname, '../', entry)}/${args.folder}/**/*.{png,jpg}`, { nodir: true })
console.log(path.resolve(__dirname, '../', entry))

const tinyJsonPath = `${path.resolve(__dirname, '../', entry)}/${args.folder}/tiny.json`
const noTinyList = fs.existsSync(tinyJsonPath) ? JSON.parse(fs.readFileSync(tinyJsonPath, 'utf-8')) : {}
const needTinyList = imgs.filter(img => {
  const imgName = getImgName(img)
  return !noTinyList[imgName] || noTinyList[imgName] !== fs.statSync(img).size
})
let failTinyList = []
let maxFailCount = 3

const TINYIMG_URL = ['tinyjpg.com', 'tinypng.com']

if (!needTinyList.length) {
  console.log(chalk.yellowBright('图片都压缩过了'))
  process.exit(0)
}

let currTinyLength = 0
const spinner = ora(`Image is compressing (${currTinyLength}/${needTinyList.length})......`).start()

;(async function () {
  const logList = []
  for (let i = 0; logList.length < needTinyList.length; i += 10) {
    const compressList = needTinyList.slice(i, i + 10)
    if (!compressList.length) break
    const res = await Promise.all(compressList.map(img => compressImg(img)))
    logList.push(...res)
  }

  while (maxFailCount !== 0 && failTinyList.length) {
    const temp = failTinyList
    failTinyList = []
    const res = await Promise.all(temp.map(img => compressImg(img.path)))
    logList.push(...res)
    maxFailCount--
  }

  const logFormat = logList.reduce((acc, curr) => {
    curr && acc.push(curr.split(' '))
    return acc
  }, [])
  console.log('\n')
  console.log(table(logFormat, { hsep: ' ' }))

  if (failTinyList.length) {
    const failLogFormat = failTinyList.reduce((acc, curr) => {
      acc.push(curr.msg.split(' '))
      return acc
    }, [])
    console.log('\n')
    console.log(table(failLogFormat, { hsep: ' ' }))
  }

  fs.writeFileSync(tinyJsonPath, JSON.stringify(noTinyList), 'utf8')
  spinner.stop()
})()

function randomHeader() {
  const ip = new Array(4)
    .fill(0)
    .map(() => parseInt(Math.random() * 255))
    .join('.')
  const index = Math.floor(Math.random() * 2)
  return {
    headers: {
      'Cache-Control': 'no-cache',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Postman-Token': Date.now(),
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36',
      'X-Forwarded-For': ip,
    },
    hostname: TINYIMG_URL[index],
    method: 'POST',
    path: '/backend/opt/shrink',
    rejectUnauthorized: false,
  }
}

function uploadImg(file) {
  const opts = randomHeader()
  return new Promise((resolve, reject) => {
    const req = https.request(opts, res =>
      res.on('data', data => {
        let obj
        try {
          obj = JSON.parse(data.toString())
        } catch (error) {
          return reject(error)
        }
        obj.error ? reject(obj.message) : resolve(obj)
      })
    )
    req.write(file, 'binary')
    req.on('error', e => reject(e))
    req.end()
  })
}

function downloadImg(url) {
  const opts = new URL(url)
  return new Promise((resolve, reject) => {
    const req = https.request(opts, res => {
      let file = ''
      res.setEncoding('binary')
      res.on('data', chunk => (file += chunk))
      res.on('end', () => resolve(file))
    })
    req.on('error', e => reject(e))
    req.end()
  })
}

function byteSize(byte = 0) {
  if (byte === 0) return '0 B'
  const unit = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i = Math.floor(Math.log(byte) / Math.log(unit))
  return (byte / Math.pow(unit, i)).toPrecision(3) + ' ' + sizes[i]
}

function getImgName(img) {
  const nameReg = new RegExp(entry + `/${args.folder}/(.*)`)
  const imgName = img.match(nameReg)
  return imgName ? imgName[1] : path.basename(img)
}

async function compressImg(img) {
  const imgName = getImgName(img)
  const overtime = 30000
  try {
    const compressed = new Promise((resolve, reject) => {
      let timeout = setTimeout(() => {
        clearTimeout(timeout)
        reject('Compression timed out')
      }, overtime)
      uploadImg(fs.readFileSync(img, 'binary'))
        .then(async obj => {
          clearTimeout(timeout)
          const data = await downloadImg(obj.output.url)
          fs.writeFileSync(img, data, 'binary')
          noTinyList[imgName] = fs.statSync(img).size
          const oldSize = chalk.redBright(byteSize(obj.input.size))
          const newSize = chalk.greenBright(byteSize(obj.output.size))
          const ratio = chalk.blueBright(~~((1 - obj.output.ratio) * 100) + '%')
          const msg = `${figures.tick} Compressed ${chalk.yellowBright(
            imgName
          )} completed: Old Size ${oldSize}, New Size ${newSize}, Optimization Ratio ${ratio}`
          resolve(msg)
        })
        .catch(e => {
          clearTimeout(timeout)
          reject(e)
        })
    })
    const msg = await compressed
    spinner.text = `Image is compressing (${++currTinyLength}/${needTinyList.length})......`
    spinner.render()
    return Promise.resolve(msg)
  } catch (err) {
    failTinyList.push({
      path: img,
      msg: `${figures.cross} ${chalk.yellowBright(imgName)} 失败原因: ${chalk.redBright(err)}`,
    })
    return Promise.resolve()
  }
}
