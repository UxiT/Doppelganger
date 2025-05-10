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
  <div class="flex flex-col items-center justify-center">
    <h1 class="text-5xl">Wagmi Example</h1>
    <Form v-if="accountData.isConnected"/>
    <appkit-button balance="hide" namespace="eip155"/>
    <appkit-network-button v-if="accountData.isConnected" />
  </div>
</template>

