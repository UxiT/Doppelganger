<script setup lang="ts">
import {reactive, ref} from "vue";
import {useAppKitAccount} from "@reown/appkit/vue";

const accountData = useAppKitAccount()

interface Form {
  amount: number | null;
  receiverAddress: string | null;
  senderAddress: string;
}

const form = reactive<Form>({
  amount: null,
  receiverAddress: null,
  senderAddress: accountData.value.address,
})

const successMessage = ref('')
const errorMessage = ref('')
const isSubmitting = ref(false)

const baseURL = import.meta.env.VITE_API_URL
console.log(baseURL)

async function handleSubmit() {
  successMessage.value = ''
  errorMessage.value = ''
  isSubmitting.value = true

  try {
    const response = await fetch(baseURL + '/v1/transfer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: form.amount,
        receiver_address: form.receiverAddress,
        sender_address: form.senderAddress,
      })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      errorMessage.value = errorData?.message || `Error: ${response.status} ${response.statusText}`
    } else {
      successMessage.value = 'Transfer successful!'
      amount.value = null
      address.value = ''
    }

  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      errorMessage.value = error.response.data.message
    } else {
      errorMessage.value = 'An error occurred during the transfer.'
    }
  } finally {
    isSubmitting.value = false
  }
}

</script>

<template>
  <form @submit.prevent="handleSubmit">
    <div>
      <label for="amount">Amount:</label>
      <input id="amount" type="number" v-model="form.amount" required />
    </div>
    <div>
      <label for="address">Address:</label>
      <input id="address" type="text" v-model="form.receiverAddress" required />
    </div>
    <button type="submit" :disabled="isSubmitting">Transfer</button>

    <p v-if="successMessage" style="color: green;">{{ successMessage }}</p>
    <p v-if="errorMessage" style="color: red;">{{ errorMessage }}</p>
  </form>
</template>
