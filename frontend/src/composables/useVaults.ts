import {ref} from "vue";
import api from "@/services/api.ts";

export interface Vaults {
  internalVaultAddress: string,
  externalVaultAddress: string,
}

interface VaultsResponse {
  data: Vaults
}

export function useVaults() {
  const vaults = ref<Vaults | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const getVaultsByIntent = async (intentId: string) => {
    loading.value = true
    error.value = null

    try {
      const response = await api.get<Vaults>(`/intents/${intentId}/vaults`)
      vaults.value = response.data
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      error.value = err.response?.data?.message || err.message || 'Failed to fetch vaults'
    } finally {
      loading.value = false
    }
  }

  const getVaults = async (): Promise<Vaults | undefined> => {
    try {
      const response: VaultsResponse = await api.get(`/vaults`)

      return response.data
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      error.value = err.response?.data?.message || err.message || 'Failed to fetch vaults'
    } finally {
      loading.value = false
    }
  }

  return {
    vaults,
    loading,
    error,
    getVaultsByIntent,
    getVaults
  }
}
