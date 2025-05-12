import { ref } from "vue";
import { writeContract, waitForTransactionReceipt } from "@wagmi/core";
import { vaultContract } from "@/contracts/vault.ts";
import {wagmiAdapter} from "@/config";


export function useWithdraw() {
  const loading = ref(false)
  const error = ref<string|null>(null)

  const withdraw = async (amount: string, contractAddress: string, walletAddress: string) => {
    loading.value = true
    error.value = null

    console.log(walletAddress, amount, BigInt(amount), contractAddress)
    const withdrawHash = await writeContract(wagmiAdapter.wagmiConfig, {
      abi: vaultContract.abi,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      address: contractAddress,
      functionName: 'withdraw',
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      args: [BigInt(amount), walletAddress]
    })

    await waitForTransactionReceipt(wagmiAdapter.wagmiConfig, {hash: withdrawHash})
  }

  return {
    loading,
    error,
    withdraw,
  }
}
