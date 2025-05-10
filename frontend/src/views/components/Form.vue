<script setup lang="ts">
import {reactive, ref} from "vue";
import {useAppKitAccount} from "@reown/appkit/vue";
import Button from "@/shared/Button.vue";

const accountData = useAppKitAccount()

interface Form {
  amount: number | null;
  receiverAddress: string | null;
  senderAddress: string;
}

const form = reactive<Form>({
  amount: null,
  receiverAddress: null,
})

const successMessage = ref('')
const errorMessage = ref('')
const isSubmitting = ref(false)

const baseURL = import.meta.env.VITE_API_URL

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
        sender_address: accountData.value.address,
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
  <form @submit.prevent="handleSubmit" class="flex flex-col items-center mb-10 mt-10">
    <div class="form-item mb-2 flex flex-row items-center">
      <label for="amount">Amount:</label>
      <input class="ml-4" id="amount" type="number" v-model="form.amount" required min="0.00001"/>
    </div>
    <div class="form-item mb-2 flex flex-row items-center">
      <label for="address">Receiver Address:</label>
      <input class="ml-4" id="address" type="text" v-model="form.receiverAddress" required />
    </div>
    <button type="submit" :disabled="isSubmitting">Transfer</button>

    <p v-if="successMessage" style="color: green;">{{ successMessage }}</p>
    <p v-if="errorMessage" style="color: red;">{{ errorMessage }}</p>
  </form>
</template>

<style scoped>
.form-item label {
  width: 150px;
  text-align: right;
  display: inline-block;

  color: #111111
}

input {
  border: 1px solid lightgray;
  border-radius: 10px;
  padding: 5px 10px;

  color: #111111
}

button {
  width: 150px;
  height: 38px;
  padding: 0.125rem 0;

  outline: none;
  border: none;
  border-radius: 12px;

  font-size: 1rem;
  font-weight: 400;

  background: #006fee;
  color: #fff;
}

button:hover {
  opacity: 0.8;
}
</style>
