<script setup lang="ts">
import Card from 'primevue/card'
import Button from 'primevue/button'
import { ref, onBeforeMount, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getPost } from '@/api/posts'

const route = useRoute()
const router = useRouter()
const postId = ref<string | undefined>(
  Array.isArray(route.params.id) ? route.params.id[0] : route.params.id
)

const post = reactive({
  title: '',
  description: '',
  content: '',
  published: false
})

onBeforeMount(async () => {
  if (postId.value) {
    const postData = await getPost(postId.value)
    if (!postData) {
      router.push('/')
      return
    }

    Object.assign(post, postData)
  }
})

const goToHome = () => {
  const router = useRouter()
  router.push('/')
}
</script>

<template>
  <div class="m-5">
    <h1 class="text-5xl font-bold mb-8 text-center">{{ post.title }}</h1>

    <div class="mx-24 text-lg">
      <div v-if="!post.published" class="text-red-600 font-semibold">
        <i class="pi pi-times"></i> Not Published
      </div>
      <div class="mb-4" v-html="post.content"></div>
    </div>
  </div>
</template>
