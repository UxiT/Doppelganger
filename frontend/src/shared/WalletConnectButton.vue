<script setup lang="js">
import { useDisconnect, useAppKit, useAppKitNetwork } from '@reown/appkit/vue'
import { networks } from '@/config/index.js'

const { open } = useAppKit()
const { disconnect } = useDisconnect()
const networkData = useAppKitNetwork()

const openAppKit = () => open({ view: 'Connect' })
const switchToNetwork = () => networkData.value.switchNetwork(networks[1])
const handleDisconnect = async () => {
  try {
    await disconnect()
  } catch (error) {
    console.error('Error during disconnect: ', error)
  }
}
</script>

<template>
  <div class="flex flex-col items-center justify-center">
    <el-button @click="openAppKit" class="cursor-pointer mb-2" type="primary">Open</el-button>
    <el-button @click="switchToNetwork" class="cursor-pointer mb-2" >Switch to Sepolia</el-button>
    <el-button @click="handleDisconnect" class="cursor-pointer" variant="bordered" >Disconenct</el-button>
  </div>
</template>
