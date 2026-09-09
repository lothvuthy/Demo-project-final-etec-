import { ref } from 'vue'
import shopio from '~/data/shopio.json'

export const useProducts = () => {
  const products = useState<any[]>('shop-products', () => [...shopio.products])
  const loaded = useState<boolean>('shop-products-loaded', () => false)
  const API_URL = 'http://localhost:8000/products'

  const loadProducts = async () => {
    try {
      const data = await $fetch<any[]>(API_URL)
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
