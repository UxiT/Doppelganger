// src/composables/useProducts.ts
import { ref } from 'vue'
import api from '@/services/api'

export interface Intent {
  id: string
  userId: string
  amount: string
  transactionId: string
  withdrawPermitted: boolean
  createdAt: Date
}

export interface CreateIntentRequest {
  amount: string
  transactionId: string
}

export function useIntents() {
  const products = ref<Intent[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const getIntents = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await api.get<Product[]>('/intents')
      products.value = response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || err.message || 'Failed to fetch intents'
    } finally {
      loading.value = false
    }
  }

  const createIntent = async (createIntentRequest: CreateIntentRequest): Promise<Intent | null> => {
    loading.value = true
    error.value = null

    try {
      const response = await api.post<{ data: Intent }>('/intents', createIntentRequest)

      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || err.message || 'Failed to create product'
      return null
    } finally {
      loading.value = false
    }
  }

  return {
    products,
    loading,
    error,
    getIntents,
    createIntent,
  }
}
