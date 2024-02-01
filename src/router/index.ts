import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/views/HomePage.vue'
import LoginPage from '@/views/LoginPage.vue'
import PostFormPage from '@/views/PostFormPage.vue'
import PostPage from '@/views/PostPage.vue'
import PostsPage from '@/views/PostsPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage
    },
    {
      path: '/posts',
      name: 'posts',
      component: PostsPage
    },
    {
      path: '/post/:id',
      name: 'post',
      component: PostPage
    },
    {
      path: '/newpost',
      name: 'newpost',
      component: PostFormPage
    },
    {
      path: '/editpost/:id',
      name: 'editpost',
      component: PostFormPage
    },
    {
      path: '/login',
      name: 'login',
      component: LoginPage
    }
  ]
})

export default router
