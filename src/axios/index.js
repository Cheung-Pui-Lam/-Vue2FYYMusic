// 引入axios和Vue
import axios from 'axios'
import Vue from 'vue'

// 设置axios初始url
axios.defaults.baseURL = 'https://netease-cloud-music-api-six-rust.vercel.app'
axios.defaults.withCredentials = true//设置允许跨域

// 在Vue原型上引入axios
Vue.prototype.$axios = axios