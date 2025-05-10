<script setup lang="ts">
import { createAppKit } from "@reown/appkit/vue";
import { wagmiAdapter, networks, projectId } from "@/config";

import WalletConnectButton from "@/components/WalletConnectButton.vue";

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
  themeVariables: {
    '--w3m-accent': '#000000',
  }
})

</script>

<template>
  <div class="flex flex-col items-center justify-center">
    <h1 class="text-5xl">Wagmi Example</h1>
    <appkit-button />
    <WalletConnectButton/>
  </div>
</template>

