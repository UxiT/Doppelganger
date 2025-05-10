<script setup lang="ts">
import { createAppKit, useAppKitAccount } from "@reown/appkit/vue";
import { wagmiAdapter, networks, projectId } from "@/config";

import WalletConnectButton from "@/shared/WalletConnectButton.vue";
import Form from "@/views/components/Form.vue";

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
  <div class="flex flex-col items-center justify-center pt-10">
    <h1 class="text-5xl font-bold">Doppelganger</h1>
    <Form v-if="accountData.isConnected"/>
    <div class="wallet flex flex-col items-end">
      <appkit-button balance="hide" namespace="eip155"/>
      <appkit-network-button class="pr-2" v-if="accountData.isConnected" />
    </div>
  </div>
</template>

<style scoped>
.wallet {
  position: absolute;
  top: 1rem;
  right: 1rem;
}
</style>
