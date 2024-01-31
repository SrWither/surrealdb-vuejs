<script setup lang="ts">
import NavBar from '@/components/NavBar.vue'
import Toast from 'primevue/toast'
import { AuthStore } from './stores/auth'
import { authenticate } from './api/auth'
import { useRouter } from 'vue-router'

const authStore = AuthStore()
const router = useRouter()

router.beforeEach(async () => {
  const isAuthenticated = await authenticate(authStore.token || '')

  if (!isAuthenticated) {
    authStore.clearToken()
  }
})
</script>

<template>
  <Toast />
  <header class="card">
    <NavBar />
  </header>

  <main>
    <router-view />
  </main>
</template>
