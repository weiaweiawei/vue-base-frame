<template>
  <header>
    <div class="wrapper">

      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { RouterLink, RouterView } from "vue-router";
import { useRouter } from "vue-router";
import { showToast } from "vant";
const router = useRouter();
onMounted(() => {
  document.oncontextmenu = function (e) {
    e.preventDefault();
  };
  document.body.addEventListener(
    "touchmove",
    (e) => {
      // 如果目标元素没有被标记为可拖动，阻止默认的拖动行为
      if (!(e.target as any).__isDraggable) {
        e.preventDefault();
      }
    },
    { passive: false }
  );
  // if (!(window as any).isTureAccount) {
  //   showToast({
  //     message: "无效用户!!!",
  //     wordBreak: "break-word",
  //   });
  //   return;
  // }

});
</script>


<style scoped lang="scss">
* {
  -webkit-touch-callout: none;
  /*系统默认菜单被禁用*/
  -webkit-user-select: none;
  /*webkit浏览器*/
  -khtml-user-select: none;
  /*早期浏览器*/
  -moz-user-select: none;
  /*火狐*/
  -ms-user-select: none;
  /*IE10*/
  user-select: none;
}

input {
  -webkit-user-select: auto;
  /*webkit浏览器*/
}
</style>
