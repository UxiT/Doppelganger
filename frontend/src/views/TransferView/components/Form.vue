<script setup lang="ts">
import { reactive, ref } from 'vue'
import { parseEther } from 'viem'
import { readContract, writeContract, waitForTransactionReceipt } from '@wagmi/core'
import { useAppKitAccount } from '@reown/appkit/vue'

import { vaultContract } from '@/contracts/vault.ts'
import { tokenContract } from '@/contracts/vaultToken.ts'
import { showError, showSuccess } from '@/shared/utils/messageBox.ts'
import { Form } from '@/views/TransferView/types/Form.ts'
import { wagmiConfig } from '@/config'
import postV1CreateTransfer from '@/api/postV1CreateTransfer.ts'
import { useIntents } from '@/composables/useIntents.ts'

const labelWidth = '150px'

const form = reactive<Form>({ amount: null, receiverAddress: null })
const formRef = ref<FormInstance | null>(null)
const isSubmitting = ref(false)
const dialogVisible = ref(false)
const depositHash = ref<string | null>(null)

const accountData = useAppKitAccount()

const handleDeposit = async (amount: bigint) => {
  const allowance = await readContract(wagmiConfig, {
    address: tokenContract.address,
    abi: tokenContract.abi,
    functionName: 'allowance',
    args: [accountData.value.address, accountData.value.address],
  })

  if (allowance < amount) {
    const approveHash = await writeContract(wagmiConfig, {
      abi: tokenContract.abi,
      address: tokenContract.address,
      functionName: 'approve',
      args: [accountData.value.address, amount - allowance],
    })

    await waitForTransactionReceipt(wagmiConfig, { hash: approveHash })
  }

  // Execute main contract call after approval
  depositHash.value = await writeContract(wagmiConfig, {
    address: vaultContract.address,
    abi: vaultContract.abi,
    functionName: 'deposit',
    args: [amount],
  })

  await waitForTransactionReceipt(wagmiConfig, { hash: depositHash.value })
}

const { createIntent } = useIntents()

async function handleSubmit() {
  isSubmitting.value = true

  await handleDeposit(parseEther(form.amount.toString())).catch((err) => {
    showError('Transaction was not completed')
    isSubmitting.value = false

    throw err
  })

  try {
    const created = await createIntent(depositHash.value.toString(), form.receiverAddress)

    if (created) {
      console.log(created.id)
      showSuccess('Created intent with id ' + created.id)
    }
  } catch (error) {
    console.error(error)

    showError('An error occurred during the transfer.')
  }

  isSubmitting.value = false
}
</script>

<template>
  <el-form v-loading="isSubmitting" :model="form" ref="formRef">
    <el-form-item label="Amount" :label-width="labelWidth">
      <el-input-number
        v-model="form.amount"
        :min="0.001"
        :step="0.001"
        controls-position="right"
        aria-required="true"
        placeholder="Enter amount"
        style="width: 100%"
      >
      </el-input-number>
    </el-form-item>

    <el-form-item label="Receiver Address" :label-width="labelWidth">
      <el-input v-model="form.receiverAddress" placeholder="Enter receiver address" />
    </el-form-item>

    <div class="flex items-center justify-center">
      <el-button :disabled="isSubmitting" type="primary" @click="handleSubmit">Submit</el-button>
    </div>

    <div v-if="depositHash" class="flex justify-center mt-10">
      <el-button @click="dialogVisible = true"> Show transaction ID </el-button>
    </div>

    <el-dialog v-model="dialogVisible" title="Transaction ID">
      <span>{{ depositHash }}</span>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="dialogVisible = false"> Close </el-button>
        </div>
      </template>
    </el-dialog>
  </el-form>
</template>
