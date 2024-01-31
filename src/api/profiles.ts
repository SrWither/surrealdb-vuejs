import { authenticate } from './auth'
import { db } from './connect'
import { getMyUser } from './users'

export type Profile = {
  id?: string
  username: string
  user?: string
}

export const createProfile = async (token: string, username: string): Promise<Profile | null> => {
  try {
    const isAuthenticated = await authenticate(token)
    if (!isAuthenticated) {
      console.error('You are not authenticated')
      return null
    }

    const [profile] = await db.create<Profile>('Profiles', {
      username
    })

    return profile
  } catch (e) {
    console.error(e)
    return null
  }
}

export const updateProfile = async (
  token: string,
  id: string,
  username: string
): Promise<Profile | null> => {
  try {
    const isAuthenticated = await authenticate(token)
    if (!isAuthenticated) {
      console.error('You are not authenticated')
      return null
    }

    const [profile] = await db.update<Profile>(id, {
      username
    })

    return profile
  } catch (e) {
    console.error(e)
    return null
  }
}

export const getProfile = async (id: string): Promise<Profile | null> => {
  try {
    const [profile] = await db.select<Profile>(id)
    return profile
  } catch (e) {
    console.error(e)
    return null
  }
}

export const getMyProfile = async (token: string): Promise<Profile | null> => {
  try {
    const user = await getMyUser(token)
    if (!user) {
      return null
    }

    const [profile] = await db.query<[Profile]>(`SELECT * FROM Profiles WHERE user = "${user.id}"`)

    return profile
  } catch (e) {
    console.error(e)
    return null
  }
}

export const getProfiles = async (): Promise<Profile[]> => {
  try {
    const profiles = await db.select<Profile>('Profiles')
    return profiles
  } catch (e) {
    console.error(e)
    return []
  }
}

export const deleteProfile = async (token: string, id: string): Promise<boolean> => {
  try {
    const isAuthenticated = await authenticate(token)
    if (!isAuthenticated) {
      console.error('You are not authenticated')
      return false
    }

    await db.delete<Profile>(id)
    return true
  } catch (e) {
    console.error(e)
    return false
  }
}
