import "@/styles/global.scss";

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

import i18n from "./i18n/index";
import "amfe-flexible";
import "./utils/rem";

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.use(i18n);
(async function Initialize() {
  try {
    //   await juggleLogin();  // 可以在初始化前获取异步信息
  } catch (e) {
    console.log(e);
  }

  app.mount("#app");
})();
