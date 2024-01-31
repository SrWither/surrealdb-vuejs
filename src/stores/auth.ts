import { defineStore } from 'pinia'
import Cookies from 'js-cookie'

interface Auth {
  token: string | null
}

const COOKIE_KEY = 'auth'

const getToken = (): string | null => {
  const token = Cookies.get(COOKIE_KEY)
  return token ? token : null
}

export const AuthStore = defineStore('auth', {
  state: (): Auth => ({
    token: getToken()
  }),
  actions: {
    setToken(token: string): void {
      this.token = token
      Cookies.set(COOKIE_KEY, token, { sameSite: 'None', secure: true })
    },
    clearToken(): void {
      this.token = null
      Cookies.remove(COOKIE_KEY)
    }
  }
})
