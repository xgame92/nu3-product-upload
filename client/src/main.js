import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import {BootstrapVue, IconsPlugin} from 'bootstrap-vue'

import axios from 'axios';

Vue.config.productionTip = false

// Import Bootstrap an BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

// Install BootstrapVue
Vue.use(BootstrapVue)

// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)

let axiosInstance = axios.create({
    baseURL: process.env.VUE_APP_API_SERVER_URL,
    timeout: 5000,
    withCredentials: true,
});

Vue.$axios = axiosInstance;

new Vue({
    store,
    router,
    render: h => h(App)
}).$mount('#app')
