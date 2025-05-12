<script setup lang="ts">
import { onMounted } from 'vue'
import { useIntents } from '@/composables/useIntents.ts'
import { parseGwei } from 'viem'
import {useWithdraw} from "@/composables/useWithdraw.ts";
import {useAppKitAccount} from "@reown/appkit/vue";
import {ElMessage} from "element-plus";

const accountData = useAppKitAccount()
const { intents, loading, getIntents } = useIntents()
const { loading: withdrawLoading, error: withdrawError, withdraw } = useWithdraw(accountData.value.address)

onMounted(() => {
  getIntents()
})

const handleWithdraw = (amount: string) => {
    const result = withdraw(amount, accountData.value.address)
      .then(() => {
        ElMessage.success("Withdraw successful")
        getIntents()
      })
      .catch(err => ElMessage.error(err))
}

</script>

<template>
  <el-card class="min-w-[450px]">
    <template #header> Withdraw Form </template>
    <div class="flex flex-row justify-between" v-if="accountData.isConnected" v-for="intent in intents">
      <el-text>{{ parseGwei(intent.amount) }}</el-text>
      <el-button
        :disabled="!intent.withdrawPermitted"
        :loading="withdrawLoading"
        @click="handleWithdraw(intent.amount)"
        type="primary"
      >
        Withdraw
      </el-button>
    </div>
  </el-card>
</template>

<style scoped></style>
