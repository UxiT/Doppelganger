<script setup lang="ts">
import { useAppKitAccount } from '@reown/appkit/vue'
import Form from '@/views/TransferView/components/Form.vue'

const accountData = useAppKitAccount()
</script>

<template>
  <el-card class="min-w-[300px] w-full">
    <template #header> Transfer Form </template>
    <Form v-if="accountData.isConnected" />
  </el-card>
</template>

<style scoped></style>
