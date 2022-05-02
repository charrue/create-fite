import { createApp } from "vue";
import App from "./App.vue";
import store from "./store";
import router from "./router";
import Antd from "ant-design-vue";
import "virtual:windi.css";

const app = createApp(App);

// 挂载pinia
app.use(store);

app.use(router);

app.use(Antd);

// 挂载实例
app.mount("#app");
