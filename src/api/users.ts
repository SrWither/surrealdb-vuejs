import { authenticate } from './auth'
import { db } from './connect'

export type User = {
  id: string
  email: string
  password: string
}

export const getMyUser = async (token: string): Promise<User | null> => {
  try {
    const isAuthenticated = await authenticate(token)
    if (!isAuthenticated) {
      console.error('You are not authenticated')
      return null
    }
    
    const user = await db.info<User>()
    if (!user) {
      return null
    }

    return user
  } catch (e) {
    console.error(e)
    return null
  }
}
