import {ref} from "vue";
import api from "@/services/api.ts";

export function useFaucet() {
  const loading = ref(false)
  const error = ref<string | null>(null)

  const mintToken = async (address: string) => {
    try {
      loading.value = true
      const response = await api.get(`/mint?address=${address}`)

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
