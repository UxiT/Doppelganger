<script setup lang="js">
import { useDisconnect, useAppKit, useAppKitNetwork } from '@reown/appkit/vue'
import { networks } from "@/config/index.js";
import Button from "@/shared/Button.vue";

const { open } = useAppKit()
const { disconnect } = useDisconnect()
const networkData = useAppKitNetwork()

const openAppKit = () => open({view: "Connect"})
const switchToNetwork = () => networkData.value.switchNetwork(networks[1])
const handleDisconnect = async () => {
  try {
    await disconnect()
  } catch (error) {
    console.error("Error during disconnect: ", error)
  }
}

</script>

<template>
  <div class="flex flex-col items-center justify-center">
    <Button @click="openAppKit" class="cursor-pointer mb-2" text="Open" type="primary"/>
    <Button @click="switchToNetwork" class="cursor-pointer mb-2" text="Switch to Sepolia"/>
    <Button @click="handleDisconnect" class="cursor-pointer" text="Disconenct" variant="bordered"/>
  </div>
</template>
