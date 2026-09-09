import { computed } from 'vue'
import { useAuth } from './useAuth'

/**
 * Wishlist ("heart") state, stored per-user on the json-server backend
 * (the user's `wishlist` field), not in localStorage directly — so it is
 * only ever available once the user is logged in.
 */
export const useWishlist = () => {
  const { user, isLoggedIn, updateUser } = useAuth()

  const wishlistIds = computed(() => (user.value?.wishlist ?? []).map(String))

  const isWishlisted = (id: string | number) => wishlistIds.value.includes(String(id))

  /**
   * Toggle a product in/out of the wishlist.
   * Returns `false` if the user isn't logged in, so the caller can redirect
   * them to the login page (which links to registration for new users).
   */
  const toggle = async (product: { id: string | number }) => {
    if (!isLoggedIn.value) return false

    const idStr = String(product.id)
    const current = wishlistIds.value
    const next = current.includes(idStr)
      ? current.filter((x) => x !== idStr)
      : [...current, idStr]

    await updateUser({ wishlist: next })
    return true
  }

  return { wishlistIds, isWishlisted, toggle }
}
