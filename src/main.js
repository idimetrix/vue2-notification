import Vue from "vue";
import App from "./App.vue";

import Filters from "vue-case";

Vue.use(Filters);

import Components from "@/components";

Vue.use(Components);

Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount("#app");
