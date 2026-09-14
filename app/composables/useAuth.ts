import { computed } from 'vue'
import { useState } from '#app'

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
const API_USERS_URL = 'http://localhost:8000/users'
/**
 * Shared, reactive auth state. `useState` makes this a singleton across the
 * whole app, so the Navbar, product cards, wishlist page, etc. all update
 * instantly when the user logs in/out or their cart/wishlist changes.
 */
export const useAuth = () => {
  const user = useState<AuthUser | null>('auth-user', () => null)
  // Called once on app startup (see app/plugins/auth.client.ts) to restore
  // the session from localStorage.
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

  /**
   * Persist a partial change (cart / wishlist / profile fields) to the
   * json-server backend, then merge the server response back into local
   * state + localStorage so every component reacts immediately.
   */
  const updateUser = async (patch: Partial<AuthUser>) => {
    if (!user.value) return
    const id = user.value.id
    const updated = await $fetch<AuthUser>(`${API_USERS_URL}/${id}`, {
      method: 'PATCH',
      body: patch
    })
    setUser({ ...user.value, ...updated })
  }

  return { user, isLoggedIn, loadFromStorage, setUser, logout, updateUser }
}
