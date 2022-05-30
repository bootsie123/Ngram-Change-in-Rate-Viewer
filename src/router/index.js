import { createRouter, createWebHistory } from "vue-router";

import MainView from "@/views/MainView";

const routes = [
  {
    path: "/",
    component: MainView
  },
  {
    path: "/*",
    redirect: "/"
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
