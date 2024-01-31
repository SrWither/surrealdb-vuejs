<script setup lang="ts">
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import { ref } from 'vue'
import { login } from '@/api/auth'
import { AuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'

const toast = useToast()
const authStore = AuthStore()
const router = useRouter()

const email = ref<string>('')
const password = ref<string>('')

const loginSuccess = () => {
  toast.add({ severity: 'success', summary: 'Login', detail: 'Successful login', life: 3000 })
}

const loginError = () => {
  toast.add({
    severity: 'error',
    summary: 'Login Error',
    detail: 'Invalid Credentials',
    life: 3000
  })
}

const handleLogin = async () => {
  const token = await login(email.value, password.value)
  if (token) {
    loginSuccess()
    authStore.setToken(token)
    router.push('/')
  } else {
    loginError()
    email.value = ''
    password.value = ''
  }
}
</script>

<template>
  <div class="flex items-center justify-center h-[90vh]">
    <Card class="sm:w-[80vw] xl:w-[40vw] p-4">
      <template #title>Login</template>
      <template #content>
        <form @submit.prevent="handleLogin">
          <div class="mb-4 md:mb-6">
            <InputText class="w-full p-2" type="email" placeholder="Email" v-model="email" />
          </div>
          <div class="mb-4 md:mb-6">
            <InputText
              type="password"
              class="w-full p-2"
              placeholder="Password"
              v-model="password"
            />
          </div>
          <Button class="w-full p-2" label="Log In" type="submit" />
        </form>
      </template>
    </Card>
  </div>
</template>
