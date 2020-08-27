import Vue from 'vue'
import Router from 'vue-router'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _34d054dc = () => interopDefault(import('../pages/about-us.vue' /* webpackChunkName: "pages/about-us" */))
const _e7adb754 = () => interopDefault(import('../pages/blog.vue' /* webpackChunkName: "pages/blog" */))
const _1bac8b1f = () => interopDefault(import('../pages/boundries.vue' /* webpackChunkName: "pages/boundries" */))
const _22282054 = () => interopDefault(import('../pages/cabinet.vue' /* webpackChunkName: "pages/cabinet" */))
const _1ae817d7 = () => interopDefault(import('../pages/cabinet/index.vue' /* webpackChunkName: "pages/cabinet/index" */))
const _15c7a16d = () => interopDefault(import('../pages/cabinet/add-car.vue' /* webpackChunkName: "pages/cabinet/add-car" */))
const _23269915 = () => interopDefault(import('../pages/cabinet/add-cargo.vue' /* webpackChunkName: "pages/cabinet/add-cargo" */))
const _73a1521f = () => interopDefault(import('../pages/cabinet/add-driver.vue' /* webpackChunkName: "pages/cabinet/add-driver" */))
const _ccdfca64 = () => interopDefault(import('../pages/cabinet/car-park.vue' /* webpackChunkName: "pages/cabinet/car-park" */))
const _704f4686 = () => interopDefault(import('../pages/cabinet/drafts.vue' /* webpackChunkName: "pages/cabinet/drafts" */))
const _38abce8a = () => interopDefault(import('../pages/cabinet/employees.vue' /* webpackChunkName: "pages/cabinet/employees" */))
const _a17069e0 = () => interopDefault(import('../pages/cabinet/feedback.vue' /* webpackChunkName: "pages/cabinet/feedback" */))
const _7e96afcb = () => interopDefault(import('../pages/cabinet/find-car.vue' /* webpackChunkName: "pages/cabinet/find-car" */))
const _d728f01a = () => interopDefault(import('../pages/cabinet/find-cargo.vue' /* webpackChunkName: "pages/cabinet/find-cargo" */))
const _6aeeb552 = () => interopDefault(import('../pages/cabinet/messages.vue' /* webpackChunkName: "pages/cabinet/messages" */))
const _06ba304b = () => interopDefault(import('../pages/cabinet/personal.vue' /* webpackChunkName: "pages/cabinet/personal" */))
const _0a8ce424 = () => interopDefault(import('../pages/cabinet/profile.vue' /* webpackChunkName: "pages/cabinet/profile" */))
const _58fdf618 = () => interopDefault(import('../pages/cabinet/rates.vue' /* webpackChunkName: "pages/cabinet/rates" */))
const _64df07cf = () => interopDefault(import('../pages/cabinet/requests.vue' /* webpackChunkName: "pages/cabinet/requests" */))
const _675b221d = () => interopDefault(import('../pages/cabinet/_else.vue' /* webpackChunkName: "pages/cabinet/_else" */))
const _04be4cf4 = () => interopDefault(import('../pages/carrier.vue' /* webpackChunkName: "pages/carrier" */))
const _130954d6 = () => interopDefault(import('../pages/catalog.vue' /* webpackChunkName: "pages/catalog" */))
const _3db49858 = () => interopDefault(import('../pages/catalog/index.vue' /* webpackChunkName: "pages/catalog/index" */))
const _ec865e80 = () => interopDefault(import('../pages/catalog/_id.vue' /* webpackChunkName: "pages/catalog/_id" */))
const _5d644dc6 = () => interopDefault(import('../pages/expeditor.vue' /* webpackChunkName: "pages/expeditor" */))
const _ef2ba518 = () => interopDefault(import('../pages/find-car.vue' /* webpackChunkName: "pages/find-car" */))
const _77563f5c = () => interopDefault(import('../pages/find-cargo.vue' /* webpackChunkName: "pages/find-cargo" */))
const _1bbb7c2e = () => interopDefault(import('../pages/find-us.vue' /* webpackChunkName: "pages/find-us" */))
const _06bb7f07 = () => interopDefault(import('../pages/news.vue' /* webpackChunkName: "pages/news" */))
const _e80f376c = () => interopDefault(import('../pages/news/index.vue' /* webpackChunkName: "pages/news/index" */))
const _7bf21d9c = () => interopDefault(import('../pages/news/_id.vue' /* webpackChunkName: "pages/news/_id" */))
const _2aab16df = () => interopDefault(import('../pages/partners.vue' /* webpackChunkName: "pages/partners" */))
const _77c20db4 = () => interopDefault(import('../pages/permits.vue' /* webpackChunkName: "pages/permits" */))
const _af3d932e = () => interopDefault(import('../pages/sender.vue' /* webpackChunkName: "pages/sender" */))
const _c6aab0f0 = () => interopDefault(import('../pages/tender.vue' /* webpackChunkName: "pages/tender" */))
const _dd7eba64 = () => interopDefault(import('../pages/index.vue' /* webpackChunkName: "pages/index" */))

// TODO: remove in Nuxt 3
const emptyFn = () => {}
const originalPush = Router.prototype.push
Router.prototype.push = function push (location, onComplete = emptyFn, onAbort) {
  return originalPush.call(this, location, onComplete, onAbort)
}

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: decodeURI('/'),
  linkActiveClass: 'nuxt-link-active',
  linkExactActiveClass: 'nuxt-link-exact-active',
  scrollBehavior,

  routes: [{
    path: "/about-us",
    component: _34d054dc,
    name: "about-us"
  }, {
    path: "/blog",
    component: _e7adb754,
    name: "blog"
  }, {
    path: "/boundries",
    component: _1bac8b1f,
    name: "boundries"
  }, {
    path: "/cabinet",
    component: _22282054,
    children: [{
      path: "",
      component: _1ae817d7,
      name: "cabinet"
    }, {
      path: "add-car",
      component: _15c7a16d,
      name: "cabinet-add-car"
    }, {
      path: "add-cargo",
      component: _23269915,
      name: "cabinet-add-cargo"
    }, {
      path: "add-driver",
      component: _73a1521f,
      name: "cabinet-add-driver"
    }, {
      path: "car-park",
      component: _ccdfca64,
      name: "cabinet-car-park"
    }, {
      path: "drafts",
      component: _704f4686,
      name: "cabinet-drafts"
    }, {
      path: "employees",
      component: _38abce8a,
      name: "cabinet-employees"
    }, {
      path: "feedback",
      component: _a17069e0,
      name: "cabinet-feedback"
    }, {
      path: "find-car",
      component: _7e96afcb,
      name: "cabinet-find-car"
    }, {
      path: "find-cargo",
      component: _d728f01a,
      name: "cabinet-find-cargo"
    }, {
      path: "messages",
      component: _6aeeb552,
      name: "cabinet-messages"
    }, {
      path: "personal",
      component: _06ba304b,
      name: "cabinet-personal"
    }, {
      path: "profile",
      component: _0a8ce424,
      name: "cabinet-profile"
    }, {
      path: "rates",
      component: _58fdf618,
      name: "cabinet-rates"
    }, {
      path: "requests",
      component: _64df07cf,
      name: "cabinet-requests"
    }, {
      path: ":else",
      component: _675b221d,
      name: "cabinet-else"
    }]
  }, {
    path: "/carrier",
    component: _04be4cf4,
    name: "carrier"
  }, {
    path: "/catalog",
    component: _130954d6,
    children: [{
      path: "",
      component: _3db49858,
      name: "catalog"
    }, {
      path: ":id",
      component: _ec865e80,
      name: "catalog-id"
    }]
  }, {
    path: "/expeditor",
    component: _5d644dc6,
    name: "expeditor"
  }, {
    path: "/find-car",
    component: _ef2ba518,
    name: "find-car"
  }, {
    path: "/find-cargo",
    component: _77563f5c,
    name: "find-cargo"
  }, {
    path: "/find-us",
    component: _1bbb7c2e,
    name: "find-us"
  }, {
    path: "/news",
    component: _06bb7f07,
    children: [{
      path: "",
      component: _e80f376c,
      name: "news"
    }, {
      path: ":id",
      component: _7bf21d9c,
      name: "news-id"
    }]
  }, {
    path: "/partners",
    component: _2aab16df,
    name: "partners"
  }, {
    path: "/permits",
    component: _77c20db4,
    name: "permits"
  }, {
    path: "/sender",
    component: _af3d932e,
    name: "sender"
  }, {
    path: "/tender",
    component: _c6aab0f0,
    name: "tender"
  }, {
    path: "/",
    component: _dd7eba64,
    name: "main"
  }],

  fallback: false
}

export function createRouter () {
  return new Router(routerOptions)
}
