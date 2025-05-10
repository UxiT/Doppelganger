<script setup lang="js">
import { useDisconnect, useAppKit, useAppKitNetwork } from '@reown/appkit/vue'
import { networks } from "@/config/index.js";

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
    <button @click="openAppKit" class="cursor-pointer">Open</button>
    <button @click="handleDisconnect" class="cursor-pointer">Disconenct</button>
    <button @click="switchToNetwork" class="cursor-pointer">Switch Network</button>
  </div>
</template>
