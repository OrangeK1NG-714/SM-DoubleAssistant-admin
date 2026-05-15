import { createRouter, createWebHashHistory } from 'vue-router'
import Login from '../views/Login.vue'
import MainBox from '../views/MainBox.vue'

import RoutesConfig from './config'
import store from '@/store/index'

const routes = [
  {
    path: "/login",
    name: 'login',
    component: Login,
  },
  {
    path: "/MainBox",
    name: 'MainBox',
    component: MainBox,
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.addRoute("MainBox", {
  path: "/index",
  component: () => import('../views/home/Home.vue')
})
router.addRoute("MainBox", {
  path: "/center",
  component: () => import('../views/center/Center.vue')
})

router.beforeEach((to, from, next) => {
  if (to.name === "login") {
    next()
  } else {
    if (!localStorage.getItem("token")) {
      next({
        path: "/login"
      })
    } else {
      if (!store.state.isGetterRouter) {
        router.removeRoute("MainBox")
        ConfigRouter();
        next({
          path: to.fullPath
        });
      } else {
        next()
      }
    }
  }
})

const ConfigRouter = () => {
  if (!router.hasRoute("MainBox")) {
    router.addRoute({
      path: "/MainBox",
      name: 'MainBox',
      component: MainBox,
    })
  }

  RoutesConfig.forEach(item => {
    checkPermission(item) && router.addRoute("MainBox", item)
  })
  store.commit("changeGetterRouter", true)
}

const checkPermission = (item) => {
  if (item.requireAdmin) {
    return store.state.userInfo.role === 'admin'
  }
  return true
}

export default router
