import { ElMessage } from 'element-plus'

export const showSuccess = (message: string) => {
  ElMessage(message)
}
export const showError = (message: string) => {
  ElMessage.error(message)
}
