import Vue from 'vue'
import App from './App.vue'
// 全局导入axios
import './axios/index'
// 全局引入store
import store from './store/index'

// 导入 Element_ui
import ElementUI from 'element-ui'
// 导入 Element-ui 样式
import 'element-ui/lib/theme-chalk/index.css'
// 插件 Element-ui
Vue.use(ElementUI)

// 导入全局初始化样式
import './assets/index.css'

//导入Aplayer
import APlayer from '@moefe/vue-aplayer';
Vue.use(APlayer, {
  productionTip: true,
});

// 路由整合
import VueRouter from 'vue-router'
Vue.use(VueRouter)

// 导入对应的路由
import discovery from './views/01.discovery.vue'
import playlists from './views/02.playlists.vue'
import songs from './views/03.songs.vue'
import mvs from './views/04.mvs.vue'
import result from './views/05.result.vue'
import playlist from './views/06.playlist.vue'
import mv from './views/07.mv.vue'

// 制定路由规则
const router = new VueRouter({
  routes: [
    {
      path: '/',
      redirect: '/discovery'
    },
    {
      // 发现音乐
      path: '/discovery',
      component: discovery
    },
    {
      // 推荐歌单
      path: '/playlists',
      component: playlists
    },
    {
      // 推荐歌单
      path: '/playlist',
      component: playlist
    },
    {
      // 最新音乐
      path: '/songs',
      component: songs
    },
    {
      // 最新音乐
      path: '/mvs',
      component: mvs
    },
    // mv详情
    {
      path: '/mv',
      component: mv
    },
    // 搜索结果页
    {
      path: '/result',
      component: result
    }
  ]
})

// 定义一个全局的时间过滤器
// 写在main.js中  即可  定义了一个全局的时间过滤器
Vue.filter('LocaleDateString',function (original) {
  const dt = new Date(original);
  const y = dt.getFullYear();
  const m = ( dt.getMonth() + 1 + '').padStart(2,'0');
  const d = (dt.getDate() + '').padStart(2,'0');
  const hh = (dt.getHours() + '').padStart(2,'0');
  const mm = (dt.getMinutes() + '').padStart(2,'0');
  const ss = (dt.getSeconds() + '').padStart(2,'0');
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
});

// 关闭生产提示
Vue.config.productionTip = false
// 安装全局事件总线
Vue.prototype.$Bus = new Vue()

new Vue({
  render: h => h(App),
  store,
  // 挂载到Vue示例上
  router
}).$mount('#app')
