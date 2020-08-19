import Vue from 'vue'
import App from './App.vue'
import router from './router';
import store from './store'

// import FastClick from 'fastclick'
import VueLazyLoad from 'vue-lazyload'
Vue.config.productionTip = false

Vue.prototype.$bus = new Vue() // 给Vue添加一个 $bus 事件总线
    //解决移动度300ms延迟
    // FastClick.attach(document.body)

//使用图片懒加载
Vue.use(VueLazyLoad, {
    loading: require('./assets/img/common/placeholder.png') //设置占位图展示
})

new Vue({
    render: h => h(App),
    router,
    store
 
}).$mount('#app')
