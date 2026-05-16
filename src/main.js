import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Particles from "@tsparticles/vue3";
import { loadSlim } from "@tsparticles/slim";
import "@/util/axios.config";
import "element-plus/es/components/message/style/css";
import "element-plus/es/components/message-box/style/css";

const app = createApp(App)

app.directive('admin', {
    mounted(el) {
        if (store.state.userInfo.role !== 'admin') {
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
  .use(store)
  .use(router)
  .mount('#app')
