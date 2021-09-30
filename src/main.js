import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 引入element
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/css/global.css'
Vue.use(ElementUI);

import axios from 'axios'
// 配置请求根路径，跨域设置在vue.config.js
axios.defaults.baseURL = '/api';
Vue.config.productionTip = false

import $ from 'jquery'

Vue.prototype.$http = axios;
Vue.prototype.$ = $;

Vue.filter('timeFormat',function(time){
  var minute = time / 60;
  var minutes = parseInt(minute);

  if(minutes<10){
    minutes = '0' + minutes;
  }

  var second = time % 60;
  var seconds = Math.round(second);
  if(seconds<10){
    seconds = '0' + seconds;
  }
  return `${minutes}:${seconds}`;
})

Vue.filter('dateFormatToYMD',function(originVal){
  const dt = new Date(originVal)

  const y = dt.getFullYear()
  const m = (dt.getMonth()+1 + '').padStart(2,'0')
  const d = (dt.getDate() + '').padStart(2,'0')

  return `${y}-${m}-${d}`
})

Vue.filter('dateFormat',function(originVal){
  const dt = new Date(originVal)

  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2,'0')
  const d = (dt.getDate() + '').padStart(2,'0')

  const hh = (dt.getHours() + '').padStart(2,'0')
  const mm = (dt.getMinutes() + '').padStart(2,'0')
  const ss = (dt.getSeconds() + '').padStart(2,'0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

Vue.prototype.resetSetItem = function(key,newVal){
  if(key === 'curPlayMusicId'){
    // 创建一个StorageEvent事件
    var newStorageEvent = document.createEvent('StorageEvent')
    const storage = {
      setItem: function(k,val){
        localStorage.setItem(k,val)
        // 初始化创建的事件
        newStorageEvent.initStorageEvent('setItem',false,false,k,null,val,null,null)
        // 派发对象
        window.dispatchEvent(newStorageEvent)
      }
    }
    return storage.setItem(key,newVal)
  }else if(key === 'currentId'){
    var newStorageEvent = document.createEvent('StorageEvent')
    const storage = {
      setItem: function(k,val){
        localStorage.setItem(k,val)
        // 初始化创建的事件
        newStorageEvent.initStorageEvent('setItem',false,false,k,null,val,null,null)
        // 派发对象
        window.dispatchEvent(newStorageEvent)
      }
    }
    return storage.setItem(key,newVal)
  }
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
