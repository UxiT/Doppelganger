import {ref} from "vue";
import {readContract} from "@wagmi/core";
import {tokenContract} from "@/contracts/vaultToken.ts";
import {wagmiAdapter} from "@/config";


export function useTokenSymbol(contractAddress: string) {
  const loading = ref(false)
  const error = ref<string|null>(null)
  const symbol = ref<string|null>(null)

  const getSymbol = async () => {
    loading.value = true
    error.value = null

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    symbol.value = await readContract(wagmiAdapter.wagmiConfig, {
      abi: tokenContract.abi,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      address: contractAddress,
      functionName: 'symbol',
      args: []
    })
  }

  return {
    symbol,
    loading,
    error,
    getSymbol,
  }
}
