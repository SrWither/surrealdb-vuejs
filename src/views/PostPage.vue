<script setup lang="ts">
import Button from 'primevue/button'
import ConfirmPopup from 'primevue/confirmpopup'
import { ref, onBeforeMount, reactive, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getPost } from '@/api/posts'
import { Marked } from 'marked'
import { markedHighlight } from 'marked-highlight'
import hljs from 'highlight.js'
import * as emoji from 'node-emoji'
import { type User, getMyUser } from '@/api/users'
import { AuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = AuthStore()

const postId = ref<string | undefined>(
  Array.isArray(route.params.id) ? route.params.id[0] : route.params.id
)
const user = ref<User | null>(null)
const post = reactive({
  title: '',
  description: '',
  content: '',
  published: false,
  updated_at: new Date(),
  user: ''
})

const marked = new Marked(
  markedHighlight({
    langPrefix: 'hljs language-',
    highlight(code, lang) {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext'
      return hljs.highlight(code, { language }).value
    }
  })
)

onBeforeMount(async () => {
  user.value = await getMyUser(authStore.token || '')
  if (postId.value) {
    const postData = await getPost(postId.value)
    if (!postData) {
      router.push('/')
      return
    }

    Object.assign(post, postData)
  }
})

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

const canEditPost = computed(() => {
  return user.value && (post.user === user.value.id || user.value.role === 'roles:admin');
});

const renderMarkdown = (markdown: string) => {
  return marked.parse(emoji.emojify(markdown))
}
</script>

<template>
  <div class="m-5">
    <h1 class="text-6xl font-bold mb-4 text-center">{{ post.title }}</h1>
    
    <div class="flex justify-center mb-4">
      <router-link v-if="canEditPost" :to="`/editpost/${postId}`">
        <Button label="Edit Post" outlined rounded />
      </router-link>
    </div>
    
    <p class="mb-4 text-center text-zinc-500">{{ formatDate(post.updated_at) }}</p>
    
    <div class="lg:mx-20 md:mx-10 sm:mx-2 text-lg">
      <div v-if="!post.published" class="text-red-600 font-semibold text-center">
        <i class="pi pi-times"></i> Not Published
      </div>
      
      <div class="mb-4 post-content" v-html="renderMarkdown(post.content)"></div>
    </div>
  </div>
</template>


<style>
@import 'highlight.js/styles/atom-one-dark.css';

.post-content {
  font-family: 'Arial', sans-serif;
  line-height: 1.6;
}

.post-content h1 {
  font-size: 2em;
  font-weight: 700;
  margin-bottom: 0.5em;
}

.post-content h2 {
  font-size: 1.8em;
  font-weight: 700;
  margin-bottom: 0.4em;
}

.post-content h3 {
  font-size: 1.5em;
  margin-bottom: 0.3em;
}

.post-content h4 {
  font-size: 1.2em;
  margin-bottom: 0.2em;
}

.post-content h5 {
  font-size: 1em;
  margin-bottom: 0.1em;
}

.post-content h6 {
  font-size: 0.8em;
  margin-bottom: 0.1em;
}

.post-content p {
  font-size: 1em;
  margin-bottom: 0.8em;
}

.post-content a {
  font-size: 1em;
  color: #0366d6;
  text-decoration: underline;
}

.post-content pre {
  padding: 1rem 0;
}

.post-content code {
  font-size: 0.9em;
  border-radius: 1rem;
  padding: 0.5rem;
  background-color: #282c34;
}

.post-content img {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 1em auto;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

</style>
