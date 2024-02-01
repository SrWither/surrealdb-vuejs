<script setup lang="ts">
import Button from 'primevue/button'
import Textarea from 'primevue/textarea'
import InputText from 'primevue/inputtext'
import Card from 'primevue/card'
import Checkbox from 'primevue/checkbox'
import { onBeforeMount, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getPost, createPost, updatePost } from '@/api/posts'
import { AuthStore } from '@/stores/auth'
import { authenticate } from '@/api/auth'
import { useToast } from 'primevue/usetoast'

const toast = useToast()
const authStore = AuthStore()
const route = useRoute()
const router = useRouter()
const postId = ref<string | undefined>(
  Array.isArray(route.params.id) ? route.params.id[0] : route.params.id
)

const isAuthenticated = ref(false)
const post = reactive({
  title: '',
  description: '',
  content: '',
  published: false
})

const loadPostData = async () => {
  if (postId.value) {
    const postData = await getPost(postId.value)
    if (!postData) {
      router.back()
      return false
    }

    Object.assign(post, postData)
  }
  return true
}

onBeforeMount(async () => {
  isAuthenticated.value = await authenticate(authStore.token || '')
  if (!isAuthenticated.value) {
    router.push('/')
  } else {
    await loadPostData()
  }
})

const handleSubmit = async () => {
  if (!post.title.trim() || !post.description.trim() || !post.content.trim()) {
    toast.add({ severity: 'error', summary: 'Post', detail: 'Please fill all fields', life: 3000 })
    return
  }
  if (postId.value) {
    const updatepost = await updatePost(
      authStore.token || '',
      postId.value,
      post.title,
      post.description,
      post.content,
      post.published
    )

    if (!updatepost) {
      toast.add({ severity: 'error', summary: 'Post', detail: 'Error to update post', life: 3000 })
      return
    }

    toast.add({
      severity: 'success',
      summary: 'Post',
      detail: 'Post updated successfully',
      life: 3000
    })
    router.push(`/post/${updatepost.id}`)
  } else {
    const newpost = await createPost(
      authStore.token || '',
      post.title,
      post.description,
      post.content,
      post.published
    )

    if (!newpost) {
      toast.add({ severity: 'error', summary: 'Post', detail: 'Error to create post', life: 3000 })
      return
    }

    toast.add({
      severity: 'success',
      summary: 'Post',
      detail: 'Post created successfully',
      life: 3000
    })
    router.push(`/post/${newpost.id}`)
  }
}
</script>

<template>
  <div class="flex items-center justify-center h-[90vh]">
    <Card class="mx-auto sm:w-full md:w-[80vw] xl:w-[40vw] p-4 max-w-full">
      <template #title>
        <h1 class="text-2xl font-bold mb-4">{{ postId ? 'Edit post' : 'New Post' }}</h1>
      </template>
      <template #content>
        <form @submit.prevent="handleSubmit">
          <div class="mb-4">
            <label for="title" class="block text-sm font-semibold text-gray-600 mb-1">Title</label>
            <InputText class="w-full p-2 border rounded" v-model="post.title" id="title" />
          </div>

          <div class="mb-4">
            <label for="description" class="block text-sm font-semibold text-gray-600 mb-1"
              >Description</label
            >
            <InputText
              class="w-full p-2 border rounded"
              v-model="post.description"
              id="description"
            />
          </div>

          <div class="mb-4">
            <label for="content" class="block text-sm font-semibold text-gray-600 mb-1"
              >Content</label
            >
            <Textarea
              class="w-full p-2 border rounded"
              v-model="post.content"
              id="content"
              rows="5"
              cols="30"
            />
          </div>

          <div class="mb-4">
            <Checkbox v-model="post.published" inputId="published" :binary="true" />
            <label for="published" class="inline-block px-2">Published</label>
          </div>

          <Button
            class="w-full p-2 bg-blue-500 text-white hover:bg-blue-600"
            :label="postId ? 'Edit Post' : 'Create Post'"
            type="submit"
          />
        </form>
      </template>
    </Card>
  </div>
</template>

<style scoped>
#content {
  resize: none;
}
</style>
