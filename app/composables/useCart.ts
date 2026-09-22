import { computed } from 'vue'
import { useAuth } from './useAuth'

export interface CartLine {
  id: string
  name: string
  price: number
  oldPrice?: number
  image: string
  qty: number
}


export const useCart = () => {
  const { user, isLoggedIn, updateUser } = useAuth()

  const items = computed<CartLine[]>(() => user.value?.cart ?? [])

  const count = computed(() => items.value.reduce((sum, i) => sum + i.qty, 0))
  const subtotal = computed(() => items.value.reduce((sum, i) => sum + i.qty * i.price, 0))
  const originalSubtotal = computed(() =>
    items.value.reduce((sum, i) => sum + i.qty * (i.oldPrice ?? i.price), 0)
  )

  const discountTotal = computed(() => Math.max(0, originalSubtotal.value - subtotal.value))

  
  const add = async (
    product: { id: string | number; name: string; price: number; oldPrice?: number; image: string },
    qty = 1
  ) => {
    if (!isLoggedIn.value) return false

    const idStr = String(product.id)
    const current = [...items.value]
    const idx = current.findIndex((i) => i.id === idStr)

    const line = current[idx];
if (line) {
  current[idx] = { ...line, qty: line.qty + qty };
}else {
      current.push({
        id: idStr,
        name: product.name,
        price: product.price,
        oldPrice: product.oldPrice,
        image: product.image,
        qty
      })
    }

    await updateUser({ cart: current })
    return true
  }

  const remove = async (id: string | number) => {
    const next = items.value.filter((i) => i.id !== String(id))
    await updateUser({ cart: next })
  }

  const updateQty = async (id: string | number, qty: number) => {
    const next = items.value.map((i) =>
      i.id === String(id) ? { ...i, qty: Math.max(1, qty) } : i
    )
    await updateUser({ cart: next })
  }

  const clear = async () => {
    await updateUser({ cart: [] })
  }

  return { items, count, subtotal, originalSubtotal, discountTotal, add, remove, updateQty, clear }
}
