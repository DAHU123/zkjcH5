import Vue from 'vue'
import App from './App'
import router from './router'
import Mint from 'mint-ui';
import 'mint-ui/lib/style.css';
import common from './assets/js/common.js'

import axios from './httpConfig/http'
Vue.prototype.$http = axios
Vue.prototype.formate_time_stamp = common.formate_time_stamp;

Vue.use(Mint);

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
