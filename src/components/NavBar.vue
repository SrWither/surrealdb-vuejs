<script setup lang="ts">
import Menubar from 'primevue/menubar'
import Button from 'primevue/button'
import { AuthStore } from '@/stores/auth'
import { useToast } from 'primevue/usetoast'

const toast = useToast()
const authStore = AuthStore()

const logoutWarn = () => {
  toast.add({ severity: 'warn', summary: 'Logout', detail: 'Successful logout', life: 3000 })
}

const handleLogout = () => {
  authStore.clearToken()
  logoutWarn()
}
</script>

<template>
  <Menubar>
    <template #start>
      <router-link to="/">
        <Button label="Home" icon="pi pi-home" text />
      </router-link>
      <router-link to="/posts">
        <Button label="Posts" icon="pi pi-search" text />
      </router-link>
    </template>
    <template #end>
      <div v-if="authStore.token">
        <router-link to="/newpost">
          <Button label="New Post" icon="pi pi-plus" text />
        </router-link>
        <Button label="Logout" icon="pi pi-user" text @click="handleLogout" />
      </div>
      <div v-else>
        <router-link to="/login">
          <Button label="Login" icon="pi pi-user" text />
        </router-link>
      </div>
    </template>
  </Menubar>
</template>
