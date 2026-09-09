import { useAuth } from '~/composables/useAuth'

export default defineNuxtPlugin(() => {
  const { loadFromStorage } = useAuth()
  loadFromStorage()
})
