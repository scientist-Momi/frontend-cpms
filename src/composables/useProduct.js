import { useProductStore } from '@/stores/productStore'
import { fetchAllProducts } from '@/api/product'

export const useProduct = () => {
  const productStore = useProductStore()

  const fetchProducts = async () => {
    try {
      const res = await fetchAllProducts()
      productStore.setProducts(res.data.data)
      return { success: true }
    } catch (err) {
      productStore.setProducts([])
      console.log('Product fetch failed', err)
      return {
        success: false,
        message: err.response?.data?.message || 'Product fetch failed',
      }
    }
  }

  return {
    fetchProducts,
  }
}
