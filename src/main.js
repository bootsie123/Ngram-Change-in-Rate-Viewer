import { createApp } from "vue";
import VueFusionCharts from "vue-fusioncharts";
import VueMathJax from "vue-mathjax-next";

import App from "./App.vue";

import router from "./router";

require("./assets/main.scss");

const app = createApp(App);

app.use(router);
app.use(VueFusionCharts);
app.use(VueMathJax);

app.mount("#app");
