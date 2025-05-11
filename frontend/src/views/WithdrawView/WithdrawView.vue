<script setup lang="ts">
import { onMounted } from 'vue'
import { useIntents } from '@/composables/useIntents.ts'
import { parseEther, parseGwei } from 'viem'

const { intents, loading, getIntents } = useIntents()

onMounted(() => {
  getIntents()
})
</script>

<template>
  <el-card class="min-w-[450px]">
    <template #header> Withdraw Form </template>
    <el-skeleton v-if="loading" rows="3" />
    <div class="flex flex-row justify-between" v-for="intent in intents">
      <el-text>{{ parseGwei(intent.amount) }}</el-text>
      <el-button :disabled="!intent.withdrawPermitted" type="primary">Withdraw</el-button>
    </div>
  </el-card>
</template>

<style scoped></style>
