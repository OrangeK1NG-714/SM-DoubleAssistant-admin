import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import Particles from "@tsparticles/vue3";
import { loadSlim } from "@tsparticles/slim";
import "@/util/axios.config";

const app = createApp(App)

app.directive('admin', {
    mounted(el) {
        if (store.state.userInfo.role !== 1) {
            el.parentNode && el.parentNode.removeChild(el)
        }
    }
})

app
  .use(Particles, {
    init: async engine => {
      await loadSlim(engine);
    },
  })
  .use(ElementPlus)
  .use(store)
  .use(router)
  .mount('#app')
