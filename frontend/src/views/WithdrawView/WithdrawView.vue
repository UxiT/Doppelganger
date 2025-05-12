<script setup lang="ts">
import { onMounted } from 'vue'
import { useIntents } from '@/composables/useIntents.ts'
import {useWithdraw} from "@/composables/useWithdraw.ts";
import {useAppKitAccount} from "@reown/appkit/vue";
import {ElMessage} from "element-plus";
import { CopyDocument } from "@element-plus/icons-vue"
import {useVaults} from "@/composables/useVaults.ts";
import {useTokenSymbol} from "@/composables/useTokenSymbol.ts";
import {tokenContract} from "@/contracts/vaultToken.ts";

const accountData = useAppKitAccount()

const { intents, loading, getIntents } = useIntents()
const { loading: withdrawLoading, withdraw } = useWithdraw(accountData.value.address)
const { vaults, error: vaultsError, getVaults } = useVaults()
const { symbol, getSymbol } = useTokenSymbol(tokenContract.address)

onMounted(() => {
  getIntents()

  if (symbol.value === null) {
    getSymbol()
  }
})

const handleWithdraw = async (amount: string, intentId: string) => {
  await getVaults(intentId)

  if (vaults.value === null || vaultsError.value !== null) {
    ElMessage.error('Could not identify withdraw address')

    return
  }

  await withdraw(amount, vaults.value.externalVaultAddress)
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
  <el-card class="min-w-[450px] w-full">
    <template #header> Withdraw </template>
    <el-skeleton v-if="loading" />
    <div class="wrapper" v-if="accountData.isConnected">
      <el-table :data="intents" style="width: 100%">
        <el-table-column prop="amount" label="Amount">
          <template #default="scope">
            {{scope.row.amount / (10 ** 18)}} <el-text v-if="symbol">{{symbol}}</el-text>
          </template>
        </el-table-column>
        <el-table-column prop="amount" label="Transaction ID">
          <template #default="scope">
            <div class="flex items-center">
              {{ compressTransactionID(scope.row.transactionId) }}
              <CopyDocument
                style="width: 1em; height: 1em; margin-left: 8px; cursor: pointer"
                @click="copy(scope.row.transactionId)"
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column label="Operation">
          <template #default="scope">
            <el-button
              :disabled="!scope.row.withdrawPermitted"
              :loading="withdrawLoading"
              @click="handleWithdraw(scope.row.amount, scope.row.id)"
            >
              Withdraw
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-card>
</template>

<style scoped></style>
