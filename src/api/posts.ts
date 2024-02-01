import { authenticate } from './auth'
import { db } from './connect'

export type Post = {
  id?: string
  title: string
  description: string
  content: string
  published: boolean
  created_at?: Date
  updated_at?: Date
  user?: string
}

export const createPost = async (
  token: string,
  title: string,
  description: string,
  content: string,
  published: boolean
): Promise<Post | null> => {
  try {
    const isAuthenticated = await authenticate(token)
    if (!isAuthenticated) {
      console.error('You are not authenticated')
      return null
    }
    const [post] = await db.create<Post>('Posts', {
      title,
      description,
      content,
      published
    })

    return post
  } catch (e) {
    console.error(e)
    return null
  }
}
export const updatePost = async (
  token: string,
  id: string,
  title: string,
  description: string,
  content: string,
  published: boolean
): Promise<Post | null> => {
  try {
    const isAuthenticated = await authenticate(token)
    if (!isAuthenticated) {
      console.error('You are not authenticated')
      return null
    }
    const [post] = await db.merge<Post>(id, {
      title,
      description,
      content,
      published
    })

    return post
  } catch (e) {
    console.error(e)
    return null
  }
}
export const getPost = async (id: string): Promise<Post | null> => {
  try {
    const [post] = await db.select<Post>(id)
    return post
  } catch (e) {
    console.error(e)
    return null
  }
}
export const getPosts = async (): Promise<Post[]> => {
  try {
    const posts = await db.select<Post>('Posts')
    return posts
  } catch (e) {
    console.error(e)
    return []
  }
}
export const deletePost = async (token: string, id: string): Promise<boolean> => {
  try {
    const isAuthenticated = await authenticate(token)
    if (!isAuthenticated) {
      console.error('You are not authenticated')
      return false
    }
    
    await db.delete<Post>(id)
    return true
  } catch (e) {

    console.error(e)
    return false
  }
}
