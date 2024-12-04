import "@/styles/global.scss";

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

import i18n from "./i18n/index";
import "amfe-flexible";
import "./utils/rem";

import {
  Button,
  Field,
  CellGroup,
  Progress,
  ImagePreview,
  Loading,
  Popup,
  Toast,
  Form,
} from "vant";
import "vant/lib/index.css";

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(Button);
app.use(Field);
app.use(CellGroup);
app.use(Progress);
app.use(ImagePreview);
app.use(Loading);
app.use(Popup);
app.use(Toast);
app.use(Form);
app.use(i18n);
app.directive("drag", {
  //自定义指令
  mounted(el: any) {
    el.__isDraggable = true; // 给元素标记为可拖动
  },
  unmounted(el: any) {
    delete el.__isDraggable;
  },
});
(async function Initialize() {
  try {
    //   await juggleLogin();  // 可以在初始化前获取异步信息
  } catch (e) {
    console.log(e);
  }

  app.mount("#app");
})();
