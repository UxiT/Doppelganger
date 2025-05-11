<script setup lang="ts">
import {RouterView} from "vue-router";
import {createAppKit, useAppKitAccount} from "@reown/appkit/vue";
import {networks, projectId, wagmiAdapter} from "@/config";

const appKit = createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
  themeMode: 'light',
  features: {
    connectMethodsOrder: ['wallet'],
    analytics: true,
  },
  metadata: {
    name: 'Doppelganger App',
    description: 'Doppelganger App',
    url: 'http://localhost',
  },
})

const accountData = useAppKitAccount()

</script>

<template>
  <RouterView/>
  <div class="wallet flex flex-col items-end">
    <appkit-button balance="hide" namespace="eip155" />
    <appkit-network-button class="pr-2" v-if="accountData.isConnected" />
  </div>
</template>

<style scoped>
.wallet {
  position: absolute;
  top: 1rem;
  right: 1rem;
}

</style>
