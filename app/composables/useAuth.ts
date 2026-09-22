import { computed } from 'vue'
import { useState } from '#app'
import shopio from '~/data/shopio.json'

export interface AuthUser {
  id: string | number
  name: string
  email: string
  role?: 'user' | 'admin'
  password?: string
  address?: string
  avatar?: string
  wishlist?: (string | number)[]
  cart?: { id: string; name: string; price: number; image: string; qty: number }[]
  [key: string]: any
}

const STORAGE_KEY = 'eshop_user'
const USERS_KEY = 'eshop_users'


export const useAuth = () => {
  const config = useRuntimeConfig()
  const apiUsersUrl = config.public.apiBase ? `${config.public.apiBase}/users` : ''
  const user = useState<AuthUser | null>('auth-user', () => null)

  const localUsers = (): AuthUser[] => {
    if (import.meta.server) return []
    const raw = localStorage.getItem(USERS_KEY)
    if (raw) {
      try {
        return JSON.parse(raw)
      } catch {
        localStorage.removeItem(USERS_KEY)
      }
    }
    const users = (shopio.users ?? []) as AuthUser[]
    localStorage.setItem(USERS_KEY, JSON.stringify(users))
    return users
  }

  const saveLocalUsers = (users: AuthUser[]) => {
    if (import.meta.client) localStorage.setItem(USERS_KEY, JSON.stringify(users))
  }
  const loadFromStorage = () => {
    if (import.meta.server) return
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return
    try {
      user.value = JSON.parse(raw)
    } catch {
      user.value = null
    }
  }

  const setUser = (u: AuthUser | null) => {
    user.value = u
    if (import.meta.client) {
      if (u) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(u))
        localStorage.setItem('eshop_logged_in', 'true')
      } else {
        localStorage.removeItem(STORAGE_KEY)
        localStorage.removeItem('eshop_logged_in')
      }
    }
  }

  const logout = () => setUser(null)

  const isLoggedIn = computed(() => !!user.value)

  const authenticate = async (email: string, password: string) => {
    if (apiUsersUrl) {
      try {
        return await $fetch<AuthUser[]>(apiUsersUrl)
        .then((users) => users.find((item) => item.email.toLowerCase() === email.toLowerCase() && item.password === password) ?? null)
      } catch {
      }
    }
    return localUsers().find((item) => item.email.toLowerCase() === email.toLowerCase() && item.password === password) ?? null
  }

  const register = async (details: Omit<AuthUser, 'id'>) => {
    if (apiUsersUrl) {
      try {
        return await $fetch<AuthUser>(apiUsersUrl, { method: 'POST', body: details })
      } catch {
      }
    }
    const created = { ...details, id: `local-${Date.now()}` } as AuthUser
    saveLocalUsers([...localUsers(), created])
    return created
  }


  const updateUser = async (patch: Partial<AuthUser>) => {
    if (!user.value) return
    const id = user.value.id
    if (apiUsersUrl) {
      try {
        const updated = await $fetch<AuthUser>(`${apiUsersUrl}/${id}`, {
        method: 'PATCH',
        body: patch
        })
        setUser({ ...user.value, ...updated })
        return
      } catch {
      }
    }
    const updated = { ...user.value, ...patch }
    saveLocalUsers(localUsers().map((item) => item.id === id ? updated : item))
    setUser(updated)
  }

  return { user, isLoggedIn, loadFromStorage, setUser, logout, authenticate, register, updateUser }
}
