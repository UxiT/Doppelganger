import {ref} from "vue";
import api from "@/services/api.ts";
import {parseEther} from "viem";

export function useFaucet() {
  const loading = ref(false)
  const error = ref<string | null>(null)

  const mintToken = async (address: string) => {
    try {
      const amount = parseEther('1')
      loading.value = true
      const response = await api.post(`/mint?address=${address}&amount=${amount}`)

      loading.value = false
      return response.data
    } catch (err) {
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    mintToken
  }
}
