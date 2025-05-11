import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { WagmiPlugin } from '@wagmi/vue'
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'
import { wagmiAdapter } from '@/config'
import App from './App.vue'
import router from '@/router'

import './styles/styles.css'
import 'element-plus/dist/index.css'

const queryClient: QueryClient = new QueryClient()

createApp(App)
  .use(createPinia())
  .use(WagmiPlugin, { config: wagmiAdapter.wagmiConfig })
  .use(VueQueryPlugin, { queryClient })
  .use(router)
  .mount('#app')
