<template>
  <div class="global-layout-container">
    <layout
      :collapsed.sync="collapsed"
      :data="menuData"
      :title="title"
    >
      <router-view></router-view>
    </layout>
  </div>
</template>

<script>
import Layout from "@charrue/layout";
import Settings from "./setting";
import "@charrue/layout/dist/style/index.css";

export default {
  name: "GlobalLayout",
  components: {
    Layout,
  },
  data() {
    return {
      menuData: Settings.menus,
      title: Settings.title,
      collapsed: false,
    };
  },
};
</script>
