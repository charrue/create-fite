import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Layout from "@/layout/index.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Layout,
    redirect: "/home",
    children: [
      {
        path: "/home",
        component: Home,
      },
      {
        path: "/about",
        component: () => import(/* webpackChunkName: "about" */ "../views/About.vue"),
      },
    ],
  },
];

const router = new VueRouter({
  routes,
});

export default router;
