import Vue from 'vue'
import store from '../store'
import routes from './routes'
import Router from 'vue-router'
import { sync } from 'vuex-router-sync'

Vue.use(Router)

// The middleware for every page of the application.
const globalMiddleware = ['check-auth']

const router = createRouter()

sync(store, router)

export default router

/**
 * Create a new router instance.
 *
 * @return {Router}
 */
function createRouter () {
  const router = new Router({
    mode: 'history',
    routes
  })
  return router
}
