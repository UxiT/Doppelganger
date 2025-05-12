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
  amount: string,
  transactionId: string,
  withdrawWalletAddress: string,
}

export function useIntents() {
  const intents = ref<Intent[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const getIntents = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await api.get<Intent[]>('/intents')
      intents.value = response.data
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      error.value = err.response?.data?.message || err.message || 'Failed to fetch intents'
    } finally {
      loading.value = false
    }
  }

  const createIntent = async (createIntentRequest: CreateIntentRequest) => {
    loading.value = true
    error.value = null

    try {
      const response = await api.post('/intents', createIntentRequest)

      return response.data
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      error.value = err.response?.data?.message || err.message || 'Failed to create intent'
      return null
    } finally {
      loading.value = false
    }
  }

  return {
    intents,
    loading,
    error,
    getIntents,
    createIntent,
  }
}
