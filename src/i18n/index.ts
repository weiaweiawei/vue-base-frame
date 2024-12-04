import { createI18n } from "vue-i18n";
// import yaml from "js-yaml";
import translationData from "./lang.yml";
interface TranslationData {
  langs: string[];
  [key: string]: any;
}

// 根据 langs 配置自动生成语言包
function getYmlData(translationData: any) {
  const messagesData: { [key: string]: { [lang: string]: string } } = {};
  const { langs, ...data } = translationData as TranslationData;
  Object.entries(data).forEach(([key, val]) => {
    langs.forEach((lang: any) => {
      messagesData[lang] = messagesData[lang] || {};
      messagesData[lang][key] = (val as { [lang: string]: string })[lang] || "";
    });
  });
  // console.log("配置包:", translationData);
  console.log("语言包:", messagesData);
  return messagesData;
}
// const parsedData = yaml.load(translationData);
const messages = getYmlData(translationData);
const curLan = localStorage.getItem("lang");
if(!curLan) localStorage.setItem("lang", "zh");
const i18n = createI18n({
  legacy: false, // 不启用 Composition API
  globalInjection: true, // 全局模式，可以直接使用 $t
  locale: localStorage.getItem("lang") || "zh", // 默认语言
  messages,
});
export default i18n;
