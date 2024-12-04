const getEnv = () => {
  const localEnv = localStorage.getItem('env')
  if (localEnv) {
    return localEnv
  }
  if (location.href.indexOf('localhost') !== -1 || /\d+\.\d+\.\d+\.\d+/.test(location.href)) {
    return 'debug'
  } else if (location.href.indexOf('test') > -1) {
    return 'test'
  } else if (location.href.indexOf('pre') > -1) {
    return 'test'
  }
  return 'product'
}

// 这些地址记得更换，只是站位
export const domainHttpMap: Record<string, string> = {
  debug: 'https://testbota.4utech.com',
  test: 'https://testbota.4utech.com',
  product: 'https://botasaas.4utech.com',
  pre: 'https://testbota.4utech.com',
}

export const domainWsMap: Record<string, string> = {
  debug: 'wss://debugbotaserver.4utech.com',
  test: 'wss://testbotaserver.4utech.com',
  product: 'wss://botaserver.4utech.com',
  pre: 'wss://testbotaserver.4utech.com',
}

export const getTTsUrlMap: Record<string, string> = {
  debug: 'https://botatts.4utech.com',
  test: 'https://botatts.4utech.com',
  product: 'https://botatts.4utech.com',
  pre: 'https://botatts.4utech.com',
}

const ua = window.navigator.userAgent
const uaLowerCase = ua.toLowerCase()

export const ENV = getEnv()

export const BOTA_API_URL = domainHttpMap[ENV]

export const BOTA_WSS_URL = domainWsMap[ENV]

export const BOTA_GET_TTS = getTTsUrlMap[ENV]

export const isIOS = !!ua.match(/Mac OS X/)

export const isAndroid = ua.indexOf('Android') > -1 || ua.indexOf('Linux') > -1

export const isWechatOrQQOrWeibo = uaLowerCase.indexOf('micromessenger') >= 0 || uaLowerCase.indexOf(' qq') > -1 || uaLowerCase.indexOf('weibo') >= 0

export const webpSupport = !![].map && document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') === 0