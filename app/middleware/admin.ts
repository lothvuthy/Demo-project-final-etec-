export default defineNuxtRouteMiddleware(() => {
  if (import.meta.server) return
  const raw = localStorage.getItem('eshop_user')
  if (!raw) return navigateTo('/auth/login')
  try {
    const user = JSON.parse(raw)
    if (user?.role !== 'admin' || user?.email?.toLowerCase() !== 'lothvuthy@gmail.com') {
      return navigateTo('/')
    }
  } catch {
    return navigateTo('/auth/login')
  }
})
