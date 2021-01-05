import Vue from 'vue'
import store from '../store'
import routes from './routes'
import Router from 'vue-router'
import {sync} from 'vuex-router-sync'
import axios from "axios";

Vue.use(Router)
let axiosInstance = axios.create({
    baseURL: process.env.VUE_APP_API_SERVER_URL,
    timeout: 5000,
    withCredentials: true
})

const router = createRouter()

router.beforeEach((to, from, next) => {
    if (to.name === 'upload') {

        axiosInstance.get('/isAuthenticated').then(() =>
            next()
        ).catch(() => {
                next({name: 'login'})
            }
        );
    } else {
        next()
    }
})

sync(store, router)

export default router

/**
 * Create a new router instance.
 *
 * @return {Router}
 */
function createRouter() {
    const router = new Router({
        mode: 'history',
        routes
    })
    return router
}
