<script setup lang="ts">
import { ref } from 'vue'
import { createAppKit, useAppKitAccount } from '@reown/appkit/vue'
import { wagmiAdapter, networks, projectId } from '@/config'
import TransferView from '@/views/TransferView/TransferView.vue'
import WithdrawView from '@/views/WithdrawView/WithdrawView.vue'

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

const activeName = ref('transfer')
</script>

<template>
  <div class="flex flex-col items-center justify-center pt-10">
    <el-tabs v-model="activeName" class="tabs">
      <el-tab-pane label="Transfer" name="transfer">
        <TransferView />
      </el-tab-pane>
      <el-tab-pane label="Withdraw" name="withdraw">
        <WithdrawView />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style scoped>
.wallet {
  position: absolute;
  top: 1rem;
  right: 1rem;
}
</style>
