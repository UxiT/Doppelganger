<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useAppKitAccount } from '@reown/appkit/vue'
import { useBalance } from "@wagmi/vue";
import { tokens } from "@/config/index.ts"
import { ElMessage } from 'element-plus'
import {sibrTestToken} from "@/config/blockchain/tokens.ts";

const accountData = useAppKitAccount()

interface Form {
  amount: number | null
  receiverAddress: string | null
  senderAddress: string
  senderToken: string | null
}

const balance = useBalance({
  address: sibrTestToken.address,
})

const form = reactive<Form>({amount: null, receiverAddress: null})
const formRef = ref<FormInstance | null>(null)
const labelWidth = '150px'

const isSubmitting = ref(false)

const showSuccess = (message: string) => { ElMessage(message) }
const showError = (message: string) => { ElMessage.error(message) }

async function handleSubmit() {
  isSubmitting.value = true

  try {
    const response = await fetch(import.meta.env.VITE_API_URL + '/v1/transfer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: form.amount,
        receiver_address: form.receiverAddress,
        sender_address: accountData.value.address,
        sender_token: form.senderToken,
      }),
    })

    if (response.ok) {
      showSuccess(response.data.message)
    } else {
      const errorData = await response.json().catch(() => null)

      showError(errorData?.message || `Error: ${response.status} ${response.statusText}`)
    }
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      showError(error.response.data.message)
    } else {
      showError('An error occurred during the transfer.')
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <el-form :model="form" ref="formRef">
      <el-form-item label="Amount" :label-width="labelWidth">
        <el-input
          v-model="form.amount"
          min="0.0001"
          step="0.0001"
          controls-position="right"
          aria-required="true"
          placeholder="Enter amount" style="width: 100%">
          <template #append>
            <el-select v-model="form.senderToken" placeholder="Token" style="width: 115px">
              <el-option v-for="token in tokens" :label="token.name" :value="token.address" />
            </el-select>
          </template>
        </el-input>
      </el-form-item>

      <el-form-item  label="Receiver Address" :label-width="labelWidth">
        <el-input v-model="form.receiverAddress" placeholder="Enter receiver address"/>
      </el-form-item>

    <div class="flex items-center justify-center">
      <el-button :disabled="isSubmitting" type="primary" @click="handleSubmit">Submit</el-button>
    </div>
  </el-form>
</template>
