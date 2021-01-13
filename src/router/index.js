import Vue from 'vue'
import Router from 'vue-router'


import { getCookie } from '@/util/cookie.js'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: () => import('@/components/login/Login.vue')
    },
    {
      path: '/404',
      name: '404',
      component: () => import('@/components/error/404.vue')
    },
    {
      path: '/Home',
      name: 'Home',
      component: () => import('@/views/Home.vue'),
      redirect: {
        name: 'material'
      },
      children: [{
        path: '/Home/material',
        name: 'material',
        component: () => import('@/views/menu/material.vue'),
        // meta: {
        //   keepAlive: true //是否需要缓存默认是false
        // }
      },
      {
        path: '/Home/NewMaterial',
        name: 'NewMaterial',
        component: () => import('@/views/menu/NewMaterial.vue'),
        // meta: {
        //   keepAlive: true //是否需要缓存默认是false
        // }
      },
      {
        path: '/Home/currentListIn',
        name: 'currentListIn',
        component: () => import('@/views/menu/currentListIn.vue'),
        // meta: {
        //   keepAlive: true //是否需要缓存默认是false
        // }
      },
      {
        path: '/Home/listRecordIn',
        name: 'listRecordIn',
        component: () => import('@/views/menu/listRecordIn.vue'),
        // meta: {
        //   keepAlive: true //是否需要缓存默认是false
        // }
      },
      {
        path: '/Home/currentListOut',
        name: 'currentListOut',
        component: () => import('@/views/menu/currentListOut.vue'),
        // meta: {
        //   keepAlive: true //是否需要缓存默认是false
        // }
      },
      {
        path: '/Home/listRecordOut',
        name: 'listRecordOut',
        component: () => import('@/views/menu/listRecordOut.vue'),
        // meta: {
        //   keepAlive: true //是否需要缓存默认是false
        // }
      },
      {
        path: '/Home/classification',
        name: 'classification',
        component: () => import('@/views/menu/classification.vue'),
        // meta: {
        //   keepAlive: true //是否需要缓存默认是false
        // }
      },
      // 路由匹配失败时，跳转到 404 页面 
      {
        path: "*",
        redirect: {
          name: '404'
        }
      }
      ]
    }
  ],
  mode: 'history', // 用于去除地址中的'#'
  scrollBehavior: () => ({ y: 0 }), // scrollBehavior 用于定义路由切换时，页面滚动。
  // isAddDynamicMenuRoutes: false
})

router.beforeEach((to, from, next) => {
  var uuid = getCookie("uuid");
  if (to.matched.length === 0) {
    from.name ? next({ name: from.name }) : next('/home');
  } else {
    if (uuid) {
      next();
    } else {
      if (to.path == "/") {
        next()
      } else {
        next("/")
      }
    }
  }
})
// 解决相同路径跳转报错
const routerPush = Router.prototype.push;
Router.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject)
    return routerPush.call(this, location, onResolve, onReject)
  return routerPush.call(this, location).catch(error => error)
}

export default router
