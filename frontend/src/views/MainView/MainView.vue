<script setup lang="ts">
import { ref } from 'vue'
import { createAppKit } from '@reown/appkit/vue'
import { wagmiAdapter, networks, projectId } from '@/config'
import TransferView from '@/views/TransferView/TransferView.vue'
import WithdrawView from '@/views/WithdrawView/WithdrawView.vue'
import FaucetView from "@/views/FaucetView/FaucetView.vue";

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

const activeTab = ref('transfer')
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const handleTabClick = (tab) => {
  activeTab.value = tab.name
}

</script>

<template>
  <div class="flex flex-col items-center justify-center pt-10">
    <el-tabs v-model="activeTab" class="tabs" @tab-click="handleTabClick">
      <el-tab-pane label="Transfer" name="transfer">
        <TransferView :key="activeTab"/>
      </el-tab-pane>
      <el-tab-pane label="Withdraw" name="withdraw">
        <WithdrawView :key="activeTab" />
      </el-tab-pane>
      <el-tab-pane label="Faucet" name="faucet">
        <FaucetView/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style scoped>
.tabs {
  width: 25%;
  min-width: 450px;
}

@media (max-width: 600px) {
  .tabs {
    width: 80%;
    min-width: 280px;
    margin-top: 15%;
  }
}
</style>
