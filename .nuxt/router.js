import Vue from 'vue'
import Router from 'vue-router'
import { normalizeURL, decode } from 'ufo'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _65756e69 = () => interopDefault(import('../pages/game.vue' /* webpackChunkName: "pages/game" */))
const _7626f4a0 = () => interopDefault(import('../pages/set-players.vue' /* webpackChunkName: "pages/set-players" */))
const _f8d09854 = () => interopDefault(import('../pages/sub-game.vue' /* webpackChunkName: "pages/sub-game" */))
const _3feaf52a = () => interopDefault(import('../pages/index.vue' /* webpackChunkName: "pages/index" */))

const emptyFn = () => {}

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: '/',
  linkActiveClass: 'nuxt-link-active',
  linkExactActiveClass: 'nuxt-link-exact-active',
  scrollBehavior,

  routes: [{
    path: "/game",
    component: _65756e69,
    name: "game"
  }, {
    path: "/set-players",
    component: _7626f4a0,
    name: "set-players"
  }, {
    path: "/sub-game",
    component: _f8d09854,
    name: "sub-game"
  }, {
    path: "/",
    component: _3feaf52a,
    name: "index"
  }],

  fallback: false
}

export function createRouter (ssrContext, config) {
  const base = (config._app && config._app.basePath) || routerOptions.base
  const router = new Router({ ...routerOptions, base  })

  // TODO: remove in Nuxt 3
  const originalPush = router.push
  router.push = function push (location, onComplete = emptyFn, onAbort) {
    return originalPush.call(this, location, onComplete, onAbort)
  }

  const resolve = router.resolve.bind(router)
  router.resolve = (to, current, append) => {
    if (typeof to === 'string') {
      to = normalizeURL(to)
    }
    return resolve(to, current, append)
  }

  return router
}
