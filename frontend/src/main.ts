import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { WagmiPlugin } from "@wagmi/vue";
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'
import { wagmiAdapter } from "@/config"
import App from './App.vue'
import './assets/main.css'

const queryClient: QueryClient = new QueryClient()

createApp(App)
  .use(createPinia())
  .use(WagmiPlugin, { config: wagmiAdapter.wagmiConfig })
  .use(VueQueryPlugin, { queryClient })
  .mount('#app')
