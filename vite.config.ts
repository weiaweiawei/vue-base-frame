import { fileURLToPath, URL } from "node:url";
import fs from "fs";
import path from "path";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
// import vueDevTools from "vite-plugin-vue-devtools";
import ViteYaml from "@modyfi/vite-plugin-yaml"; // 引入 yaml 插件，这里主要是为了解析 yaml的多语言 文件

export default defineConfig({
  plugins: [vue(), ViteYaml()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "@js/*": fileURLToPath(new URL("./src/js", import.meta.url)),
      "@pb/*": fileURLToPath(new URL("./src/pb", import.meta.url)),
      "@component/*": fileURLToPath(
        new URL("./src/component", import.meta.url)
      ),
      "@utils": path.resolve(__dirname, "./src/utils"),
    },
  },
  server: {
    https: {
      // 是否本地启动 https
      key: fs.readFileSync(
        path.resolve(__dirname, "./localKey/localhost-key.pem")
      ),
      cert: fs.readFileSync(
        path.resolve(__dirname, "./localKey/localhost.pem")
      ),
    },
    host: "0.0.0.0",
    port: 8888,
  },
  esbuild: {
    // 打包时，删除 console.log 和 debugger
    pure: ["console.log"],
    drop: ["debugger"],
  },
});
