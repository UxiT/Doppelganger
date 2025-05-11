import { ref } from 'vue';
import api from '@/services/api';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';

interface LoginCredentials {
  username: string;
  password: string;
}

interface LoginResponse {
  message: string,
  token: string,
  userId: string,
}

export function useLogin() {
  const router = useRouter();
  const loading = ref(false);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    loading.value = true;
    try {
      const response = await api.post<LoginResponse>('/login', credentials);
      const token = response.data.token;

      if (token) {
        localStorage.setItem('access_token', token);
        ElMessage.success('Login successful!');
        router.push('/');
      } else {
        throw new Error('No token received');
      }
    } catch (error: any) {
      ElMessage.error(error.response?.data?.message || 'Login failed.');
    } finally {
      loading.value = false;
    }
  };

  return { login, loading };
}
