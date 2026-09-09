export default defineNuxtRouteMiddleware(() => {
  // Only run on the client because localStorage
  // does not exist during server-side rendering.
  if (import.meta.server) {
    return
  }

  const user = localStorage.getItem('eshop_user')

  // User is not logged in
  if (!user) {
    return navigateTo('/auth/login')
  }
})
