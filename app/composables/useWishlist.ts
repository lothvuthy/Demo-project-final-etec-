import { computed } from 'vue'
import { useAuth } from './useAuth'


export const useWishlist = () => {
  const { user, isLoggedIn, updateUser } = useAuth()

  const wishlistIds = computed(() => (user.value?.wishlist ?? []).map(String))

  const isWishlisted = (id: string | number) => wishlistIds.value.includes(String(id))


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
