import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import numFormatter from 'numb-form';
import './assets/styles/reset.css'
import 'element-ui/lib/theme-chalk/index.css'
import VueCropper from 'vue-cropper'

import VeLine from 'v-charts/lib/line.common';
import 'echarts/lib/component/markLine';
import 'echarts/lib/component/markPoint';
import 'echarts/lib/component/markArea';
import 'echarts/lib/component/visualMap';
import 'echarts/lib/component/dataZoom';
import 'echarts/lib/component/toolbox';
import 'echarts/lib/component/title';
import 'zrender/lib/svg/svg';
import 'v-charts/lib/style.css';


import './static/reset.css';
import './static/common.css';
import {router} from './router'
import store from './store'
import api from '@/api'
import hlet from 'hlet'

Vue.component(VeLine.name, VeLine);

Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.use(hlet);
Vue.use(VueCropper);
Vue.prototype.$api = api;
Vue.prototype.$numFormatter = (n=0) => numFormatter(n)
//将app挂载到window上面，可以使用router的方法和一些弹窗效果。
window.VueApp = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
