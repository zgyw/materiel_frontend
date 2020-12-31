// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
// 全局引入element
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import {get,post} from './util/http'

Vue.prototype.$get = get
Vue.prototype.$post = post

Vue.use(ElementUI)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})