<script setup lang="ts">
import { onMounted } from 'vue'
import { useIntents } from '@/composables/useIntents.ts'
import {useWithdraw} from "@/composables/useWithdraw.ts";
import {useAppKitAccount} from "@reown/appkit/vue";
import {ElMessage} from "element-plus";
import { CopyDocument } from "@element-plus/icons-vue"

const accountData = useAppKitAccount()
const { intents, loading, getIntents } = useIntents()
const { loading: withdrawLoading, error: withdrawError, withdraw } = useWithdraw(accountData.value.address)

onMounted(() => {
  getIntents()
})

const handleWithdraw = async (amount: string) => {
    const result = await withdraw(amount, accountData.value.address)
      .then(() => {
        ElMessage.success("Withdraw successful")
        getIntents()
      })
      .catch(err => ElMessage.error(err))
}

const compressTransactionID = (transactionId: string): string => {
  return `${transactionId.substring(0, 4)}...${transactionId.substring(transactionId.length - 4)}`
}

const copy = (value: string) => {
  navigator.clipboard.writeText(value)
    .then(() => ElMessage.info('Transaction ID copied to clipboard'))
    .catch(err => ElMessage.error('Failed to copy to clipboard: ' + err))
}

</script>

<template>
  <el-card class="min-w-[450px]">
    <template #header> Withdraw </template>
    <div class="wrapper" v-if="accountData.isConnected">
      <div v-for="intent in intents" :key="intent.id" class="flex flex-row justify-between mb-3">
        <div class="flex flex-row items-center">
          <el-text>Amount: {{ intent.amount / (10 ** 18) }} ({{ compressTransactionID(intent.transactionId)}})</el-text>
          <CopyDocument
            style="width: 1em; height: 1em; margin-left: 8px; cursor: pointer"
            @click="copy(intent.transactionId)"
          />
        </div>

        <el-button
          :disabled="!intent.withdrawPermitted"
          :loading="withdrawLoading"
          @click="handleWithdraw(intent.amount)"
        >
          Withdraw
        </el-button>
      </div>
      <el-text v-if="intents.length === 0">You do not have active withdrawals</el-text>
    </div>
  </el-card>
</template>

<style scoped></style>
