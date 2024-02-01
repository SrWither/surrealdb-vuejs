<script setup lang="ts">
import Card from 'primevue/card'
import Button from 'primevue/button'
import { db } from '@/api/connect'
import { getPosts, type Post } from '@/api/posts'
import { onBeforeMount, onUnmounted, ref } from 'vue'

const posts = ref<Post[]>([])
const queryUuid = ref<string>('')

onBeforeMount(async () => {
  posts.value = await getPosts()
  setupLive()
})

const setupLive = async () => {
  const uuid = await db.live('Posts', async ({ action }) => {
    if (action === 'CLOSE') return

    if (action === 'CREATE') {
      posts.value = await getPosts()
      console.log('Live Post!')
    }
  })
  queryUuid.value = uuid
}

onUnmounted(async () => {
  await db.kill(queryUuid.value)
})

const truncateText = (text: string, maxLength: number) => {
  if (text.length > maxLength) {
    return text.slice(0, maxLength) + '...'
  }
  return text
}

const formatDate = (date: Date) => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }
  return new Date(date).toLocaleString('en-US', options)
}
</script>

<template>
  <div class="grid lg:grid-cols-3 md:grid-cols-2 gap-5 p-5">
    <Card v-for="post in posts" :key="post.id">
      <template #title>
        <h1 class="text-xl font-bold mb-2">{{ post.title }}</h1>
      </template>
      <template #content>
        <p class="text-gray-400">{{ truncateText(post.description, 100) }}</p>
      </template>
      <template #footer>
        <div class="flex justify-between items-center mt-4">
          <router-link :to="`/post/${post.id}`">
            <Button label="Read More" class="p-button-primary" />
          </router-link>
          <div class="text-gray-500">{{ formatDate(post.updated_at || new Date()) }}</div>
        </div>
      </template>
    </Card>
  </div>
</template>