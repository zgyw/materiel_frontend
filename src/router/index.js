import Vue from 'vue'
import Router from 'vue-router'

//页面
import HelloWorld from '@/components/HelloWorld'
import Login from '../components/login/Login.vue'

Vue.use(Router)

const router = new Router({
  routes: [
    { path: '/',redirect:'/login'},
    { path: '/login', component: Login }
  ]
})

export default router
