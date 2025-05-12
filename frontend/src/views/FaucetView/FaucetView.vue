<script setup lang="ts">

import {useAppKitAccount} from "@reown/appkit/vue";
import {useFaucet} from "@/composables/useFaucet.ts";
import {showError, showSuccess} from "@/shared/utils/messageBox.ts";

const accountData = useAppKitAccount()
const {loading, mintToken} = useFaucet()

const handleMint = async () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  await mintToken(accountData.value.address)
    .then(() => showSuccess('Successfully minted'))
    .catch((err) => {
      console.error(err)
      showError('Mint Error!')
    })
}

</script>

<template>
  <el-card class="min-w-[450px] w-full">
    <template #header> Faucet </template>
    <el-button v-if="accountData.isConnected" v-loading="loading" type="primary" @click="handleMint">
      Mint 1 VTK
    </el-button>
  </el-card>
</template>
