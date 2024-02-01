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
</script>

<template>
  <div class="grid lg:grid-cols-3 md:grid-cols-2 gap-5 p-5">
    <Card v-for="post in posts" :key="post.id">
      <template #title>
        <h1>{{ post.title }}</h1>
      </template>
      <template #content>
        <h1>{{ post.title }}</h1>
      </template>
      <template #footer>
        <router-link :to="`/post/${post.id}`">
          <Button label="Go" />
        </router-link>
      </template>
    </Card>
  </div>
</template>
