<script setup lang="ts">
import {RouterView, useRouter} from 'vue-router'
import { createAppKit, useAppKitAccount } from '@reown/appkit/vue'
import { networks, projectId, wagmiAdapter } from '@/config'


const appKit = createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
  themeMode: 'light',
  features: {
    connectMethodsOrder: ['wallet'],
    analytics: true,
  },
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  metadata: {
    name: 'Doppelganger App',
    description: 'Doppelganger App',
    url: 'http://localhost',
  },
})

const router = useRouter()
const accountData = useAppKitAccount()
const logout = () => {
  localStorage.removeItem('access_token')
  router.push('/login')
}
</script>

<template>
  <RouterView />
  <div class="wallet flex flex-col items-end">
    <appkit-button balance="hide" namespace="eip155" />
    <appkit-network-button class="pr-2" v-if="accountData.isConnected" />
    <el-button type="danger" plain class="mr-2 mt-3" @click="logout">Logout</el-button>
  </div>
</template>

<style scoped>
.wallet {
  position: absolute;
  top: 1rem;
  right: 1rem;
}
</style>
