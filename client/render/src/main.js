import Vue from 'vue';
import App from './App.vue';

//图标
import '@/css/iconfont.scss';
//清除样式
import '@/css/zh-common.scss';

Vue.config.productionTip = false;

new Vue({
    render: (h) => h(App),
}).$mount('#app');
