<template>
  <el-card class="max-w-[450px] mt-10 mx-auto">
  <el-form
    :model="form"
    :rules="rules"
    ref="registerForm"
    label-width="120px"
    class="auth-form"
  >
    <el-form-item label="Username" prop="username">
      <el-input v-model="form.username" autocomplete="off" />
    </el-form-item>

    <el-form-item label="Email" prop="email">
      <el-input v-model="form.email" autocomplete="off" />
    </el-form-item>

    <el-form-item label="Password" prop="password">
      <el-input
        v-model="form.password"
        type="password"
        autocomplete="off"
      />
    </el-form-item>

    <el-form-item>
      <el-button
        type="primary"
        :loading="loading"
        @click="submitForm"
      >
        Register
      </el-button>
      <el-button @click="resetForm">Reset</el-button>
    </el-form-item>

    <el-form-item>
      <el-text>Already have an account?</el-text>
      <el-button class="ml-2" type="text" @click="goToLogin">Login</el-button>
    </el-form-item>
  </el-form>
  </el-card>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRegister } from '@/composables/useRegister';
import type { FormInstance } from 'element-plus';
import router from '@/router';

interface RegisterForm {
  username: string;
  email: string;
  password: string;
}

const form = ref<RegisterForm>({
  username: '',
  email: '',
  password: '',
});

const rules = {
  username: [
    { required: true, message: 'Please input username', trigger: 'blur' },
    { min: 3, message: 'Username must be at least 3 characters', trigger: 'blur' },
  ],
  email: [
    { required: true, message: 'Please input email', trigger: 'blur' },
    { type: 'email', message: 'Please input a valid email', trigger: ['blur', 'change'] },
  ],
  password: [
    { required: true, message: 'Please input password', trigger: 'blur' },
    { min: 6, message: 'Password must be at least 6 characters', trigger: 'blur' },
  ],
};

const registerForm = ref<FormInstance>();

const { register, loading } = useRegister();

const submitForm = () => {
  registerForm.value?.validate((valid) => {
    if (valid) {
      register({
        username: form.value.username,
        email: form.value.email,
        password: form.value.password,
      });
    }
  });
};

const resetForm = () => {
  registerForm.value?.resetFields();
};

const goToLogin = () => {
  router.push('/login');
};
</script>

<style scoped>
.auth-form {
  max-width: 400px;
  margin: 0 auto;
}
</style>
