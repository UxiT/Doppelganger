import { ref } from "vue";
import { writeContract, waitForTransactionReceipt } from "@wagmi/core";
import { vaultContract } from "@/contracts/vault.ts";
import { wagmiConfig } from "@/config";


export function useWithdraw(walletAddress: string) {
  const loading = ref(false)
  const error = ref<string|null>(null)

  const withdraw = async (amount: string, contractAddress: string) => {
    loading.value = true
    error.value = null

    const withdrawHash = await writeContract(wagmiConfig, {
      abi: vaultContract.abi,
      address: contractAddress,
      functionName: 'withdraw',
      args: [BigInt(amount), walletAddress]
    })

    await waitForTransactionReceipt(wagmiConfig, {hash: withdrawHash})
  }

  return {
    loading,
    error,
    withdraw,
  }
}
