import { ref } from 'vue'
import shopio from '~/data/shopio.json'

export const useProducts = () => {
  const config = useRuntimeConfig()
  const products = useState<any[]>('shop-products', () => [...shopio.products])
  const loaded = useState<boolean>('shop-products-loaded', () => false)
  const apiUrl = config.public.apiBase ? `${config.public.apiBase}/products` : ''

  const loadProducts = async () => {
    if (!apiUrl) {
      loaded.value = true
      return products.value
    }
    try {
      const data = await $fetch<any[]>(apiUrl)
      if (Array.isArray(data) && data.length) products.value = data
    } catch (error) {
      console.warn('Using local product data because the API is unavailable.', error)
    } finally {
      loaded.value = true
    }
    return products.value
  }

  return { products, loaded, loadProducts }
}
