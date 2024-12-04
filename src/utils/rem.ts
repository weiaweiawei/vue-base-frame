// 基准大小
const baseSize = 37.5;
// 设置 rem 函数
function setRem() {
  const scale = document.documentElement.clientWidth / 750;
  let fontSize = baseSize * scale;
  document.documentElement.style.fontSize = fontSize + "px";
}
// 初始化
setRem();
// 改变窗口大小时重新设置 rem,这里最好加上节流
window.onresize = function () {
  setRem();
};
