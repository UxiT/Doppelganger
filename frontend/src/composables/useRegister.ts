import { ref } from 'vue'
import api from '@/services/api'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

interface RegisterData {
  username: string
  email: string
  password: string
  internalWallet: string
}

export function useRegister() {
  const router = useRouter()
  const loading = ref(false)

  const register = async (userData: RegisterData): Promise<void> => {
    loading.value = true
    try {
      await api.post('/register', userData)

      ElMessage.success('Registration successful! Please login.')
      router.push('/login')
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      ElMessage.error(error.response?.data?.message || 'Registration failed.')
    } finally {
      loading.value = false
    }
  }

  return { register, loading }
}
