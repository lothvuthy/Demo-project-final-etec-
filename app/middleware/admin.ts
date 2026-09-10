export default defineNuxtRouteMiddleware(() => {
  if (import.meta.server) return
  const raw = localStorage.getItem('eshop_user')
  if (!raw) return navigateTo('/auth/login')
  try {
    const user = JSON.parse(raw)
    if (user?.role !== 'admin') {
      return navigateTo('/')
    }
  } catch {
    return navigateTo('/auth/login')
  }
})
