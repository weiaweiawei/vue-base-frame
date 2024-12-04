export const webpSupport = !![].map && document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') === 0

export const requireImg = (name) => {
    if (!name) return ''
    try {
      return require(`./img/${name}.${webpSupport ? 'webp' : 'png'}`)
    } catch (error) {
      // 如果引入失败，则尝试使用png格式的默认图片
      return require(`./img/${name}.png`)
    }
  }

//   <img class="googlePlayPc" v-lazy="requireImg('xxx.img')" alt="" />
