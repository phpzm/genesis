import Vue from 'vue'
import Router from 'vue-router'
import { Routes } from 'genesis'

Vue.use(Router)

/**
 * @type {VueRouter}
 */
const AppRouter = new Router({routes: []})

/**
 * @type {Function}
 */
export const load = Routes.get('load')

/**
 * @type {Array}
 */
export const routes = Routes.get('routes')

/**
 * @param {Array} news
 */
export const add = (news) => {
  routes.push(...news)
  AppRouter.addRoutes(configure(news))
}

/**
 * @param {Array} routes
 */
export const configure = (routes) => {
  return routes.map(route => {
    route.component = load(route.component)
    if (route.children) {
      route.children = configure(route.children)
    }
    return route
  })
}

AppRouter.addRoutes(configure(routes))

AppRouter.beforeEach(Routes.get('beforeEach'))
AppRouter.afterEach(Routes.get('afterEach'))

export default AppRouter
