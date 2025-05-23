<script setup lang="ts">
import { reactive, ref } from 'vue'
import { parseEther } from 'viem'
import { readContract, writeContract, waitForTransactionReceipt } from '@wagmi/core'
import { useAppKitAccount } from '@reown/appkit/vue'

import { vaultContract } from '@/contracts/vault.ts'
import { tokenContract } from '@/contracts/vaultToken.ts'
import { showError, showSuccess } from '@/shared/utils/messageBox.ts'
import { type Form } from '@/views/TransferView/types/Form.ts'
import {wagmiAdapter} from '@/config'
import { useIntents } from '@/composables/useIntents.ts'
import { type FormInstance } from "element-plus";
import {useVaults} from "@/composables/useVaults.ts";

const form = reactive<Form>({ amount: null, withdrawWalletAddress: null })
const formRef = ref<FormInstance | null>(null)
const isSubmitting = ref(false)
const loadingText = ref<string>('Loading...')
const dialogVisible = ref(false)
const depositHash = ref<string | null>(null)

const accountData = useAppKitAccount()

const { getVaults } = useVaults()

const handleDeposit = async (amount: bigint) => {
  const vaults = await getVaults()

  if (vaults === undefined) {
    throw new Error('Could not get vault address')
  }

  loadingText.value = 'Waiting for transaction to process in blockchain...'

  const allowance = await readContract(wagmiAdapter.wagmiConfig, {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    address: tokenContract.address,
    abi: tokenContract.abi,
    functionName: 'allowance',
    args: [accountData.value.address, vaults.internalVaultAddress],
  })

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  if (allowance < amount) {
    const approveHash = await writeContract(wagmiAdapter.wagmiConfig, {
      abi: tokenContract.abi,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      address: tokenContract.address,
      functionName: 'approve',
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      args: [vaults.internalVaultAddress, amount - allowance],
    })

    await waitForTransactionReceipt(wagmiAdapter.wagmiConfig, { hash: approveHash })
  }

  // Execute main contract call after approval
  depositHash.value = await writeContract(wagmiAdapter.wagmiConfig, {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    address: vaults.internalVaultAddress,
    abi: vaultContract.abi,
    functionName: 'deposit',
    args: [amount],
  })

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  await waitForTransactionReceipt(wagmiAdapter.wagmiConfig, { hash: depositHash.value })
}

const { error: intentError, createIntent } = useIntents()

async function handleSubmit() {
  isSubmitting.value = true

  if (form.amount === null) {
    showError("Enter amount")
    return
  }

  if (form.withdrawWalletAddress === null) {
    showError("Enter receiver address")
    return
  }

  const amount = parseEther(form.amount.toString())

  await handleDeposit(amount).catch((err) => {
    showError('Transaction was not completed')
    isSubmitting.value = false

    throw err
  })

  if (depositHash.value === null) {
    showError("transaction error")
    return
  }

  try {
    loadingText.value = 'Loading...'

    const created = await createIntent({
      amount: amount.toString(),
      transactionId: depositHash.value.toString(),
      withdrawWalletAddress: form.withdrawWalletAddress,
    })

    if (created) {
      showSuccess('Created intent with id ' + created?.intentId)
    }

    if (intentError.value !== null) {
      showError(intentError.value)
    }

  } catch (error) {
    console.error(error)

    showError('An error occurred during the transfer.')
  }

  loadingText.value = 'Loading...'
  isSubmitting.value = false
}
</script>

<template>
  <el-form
    v-loading="isSubmitting"
    :element-loading-text="loadingText"
    :model="form"
    ref="formRef"
  >
    <el-form-item label="Amount" class="label">
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

    <el-form-item label="Receiver Address" class="label">
      <el-input v-model="form.withdrawWalletAddress" placeholder="Enter receiver address" />
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

<style>
.label label {
  width: 150px;
}
@media (max-width: 600px) {
  .label label {
    display: none;
  }
}

</style>
