/**
 * 图片转webp格式的脚本
 */
const program = require('commander');
const glob = require('glob');
const colors = require('colors');
const path = require('path');
const webp = require('webp-converter');

program
  .version('0.1.0')
  .option('-f, --folder <string>', 'Add folder')
  .parse(process.argv);

function validateProgram() {
  if (!program.folder) {
    console.log('请先指定图片目录名 \n'.red);
    process.exit(1);
  }

}
validateProgram();

const entry = `./src`;
const imgs = glob.sync(`${path.resolve(__dirname, '../', entry)}/${program.folder}/**/*.{png,svg,jpeg,jpg,gif}`, { nodir: true });

// cwebp参数确实需要传回调函数
// imgs.forEach(img => {
//   const webpFilename = img.replace(/.(png|svg|jpe?g)$/i, '.webp');
//   webp.cwebp(img, webpFilename, '-q 75', (status, error) =>
//   {
//     console.log(status, error);
//   });
// });
imgs.forEach(img => {
  const webpFilename = img.replace(/.(png|svg|jpe?g)$/i, '.webp');
  webp.cwebp(img, webpFilename, '-q 75');
});
