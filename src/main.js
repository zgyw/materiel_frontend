// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
// 全局引入element
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import i18n from '@/i18n/index.js';
import less from 'less'
import {get,post,postForm,getFile} from './util/http'
Vue.prototype.$get = get
Vue.prototype.$post = post
Vue.prototype.$postForm = postForm
Vue.prototype.$getFile = getFile
Vue.use(less)
Vue.use(ElementUI)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  i18n,
  components: { App },
  template: '<App/>'
})