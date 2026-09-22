export default defineNuxtRouteMiddleware(() => {
  if (import.meta.server) {
    return
  }

  const user = localStorage.getItem('eshop_user')
  if (!user) {
    return navigateTo('/auth/login')
  }
})
