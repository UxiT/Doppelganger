import { ref } from 'vue'
import api from '@/services/api'
import { ElMessage } from 'element-plus'

interface CreateIntentRequest {
  username: string
  password: string
}

interface CreateIntentResponse {
  message: string
  intentId: string
  vaults: {
    internalAddress: string
    externalAddress: string
  }
}

export function useCreateIntent() {
  const loading = ref(false)

  const createIntent = async (request: CreateIntentRequest): Promise<void> => {
    loading.value = true
    try {
      const response = await api.post('/intents', credentials)
      const data: CreateIntentResponse = response.data

      return data.message
    } catch (error: any) {
      ElMessage.error(error.response?.data?.message || 'Intent creation failed.')
    } finally {
      loading.value = false
    }
  }

  return { createIntent, loading }
}
