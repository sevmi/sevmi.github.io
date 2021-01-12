import Vue from 'vue'
import App from './App'
import routers from './router.js'
import VueRouter from 'vue-router'
import Loading from 'vue-loading-overlay'
import ParseMi from './components/parse-mi'
import VuejsDialog from 'vuejs-dialog';
import './assets/main.css'
import 'spectre.css/dist/spectre.css'
import 'spectre.css/dist/spectre-icons.css'
import 'vue-loading-overlay/dist/vue-loading.css'
import 'vuejs-dialog/dist/vuejs-dialog.min.css';

Vue.config.productionTip = false;

Vue.use(VueRouter)
Vue.use(Loading, {color: '#ffffff', backgroundColor: '#000000'});
Vue.use(VuejsDialog)
Vue.use(ParseMi)

const router = new VueRouter({
  mode: 'history',
  linkActiveClass: 'open active',
  routes: routers
});

new Vue({
  render: h => h(App),
  components: { App },
  router: router,
}).$mount('#app')