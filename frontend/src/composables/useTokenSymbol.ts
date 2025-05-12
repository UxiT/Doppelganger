import { ref } from "vue";
import { readContract } from "@wagmi/core";
import { tokenContract} from "@/contracts/vaultToken.ts";
import { wagmiConfig } from "@/config";


export function useTokenSymbol(contractAddress: string) {
  const loading = ref(false)
  const error = ref<string|null>(null)
  const symbol = ref<string|null>(null)

  const getSymbol = async () => {
    loading.value = true
    error.value = null

    const sym: string = await readContract(wagmiConfig, {
      abi: tokenContract.abi,
      address: contractAddress,
      functionName: 'symbol',
      args: []
    })

    symbol.value = sym
  }

  return {
    symbol,
    loading,
    error,
    getSymbol,
  }
}
