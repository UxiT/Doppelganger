<template>
  <el-card class="max-w-[450px] mt-10 mx-auto">
    <el-form :model="form" :rules="rules" ref="loginForm" label-width="120px" class="auth-form">
      <el-form-item label="Login" prop="username">
        <el-input v-model="form.username" autocomplete="off" />
      </el-form-item>

      <el-form-item label="Password" prop="password">
        <el-input v-model="form.password" type="password" autocomplete="off" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" :loading="loading" @click="submitForm"> Login </el-button>
        <el-button @click="resetForm">Reset</el-button>
      </el-form-item>

      <el-form-item>
        <el-text>Don't have and account?</el-text>
        <el-button class="ml-2" type="text" @click="goToRegister">Register</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useLogin } from '@/composables/useLogin'
import type { FormInstance } from 'element-plus'
import router from '@/router'

interface LoginForm {
  username: string
  password: string
}

const form = ref<LoginForm>({
  email: '',
  password: '',
})

const rules = {
  username: [
    { required: true, message: 'Please input username', trigger: 'blur' },
    { min: 3, message: 'Username must be at least 3 characters', trigger: 'blur' },
  ],
  password: [{ required: true, message: 'Please input password', trigger: 'blur' }],
}

const loginForm = ref<FormInstance>()

const { login, loading } = useLogin()

const submitForm = () => {
  loginForm.value?.validate((valid) => {
    if (valid) {
      login({
        username: form.value.username,
        password: form.value.password,
      })
    }
  })
}

const resetForm = () => {
  loginForm.value?.resetFields()
}

const goToRegister = () => {
  router.push('/register')
}
</script>
