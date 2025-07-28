import { useProductStore } from '@/stores/productStore'
import {
  fetchAllProducts,
  createNewProduct,
  updateProductById,
  fetchProductById,
  fetchAllTransactionsOnAProduct,
  fetchProductVariants,
  createNewProductVariant,
} from '@/api/product'

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

  const createProduct = async (payload) => {
    try {
      const res = await createNewProduct(payload)
      console.log(res)
      return { success: true, data: res.data.data }
    } catch (err) {
      console.log('Creation failed', err)
      return {
        success: false,
        message: err.response?.data?.message || 'Creation failed',
      }
    }
  }

  const updateProduct = async (id, payload) => {
    try {
      const res = await updateProductById(id, payload)
      console.log(res)
      return { success: true, data: res }
    } catch (err) {
      console.log('Update failed', err)
      return {
        success: false,
        message: err.response?.data?.message || 'Update failed',
      }
    }
  }

  const fetchProductId = async (payload) => {
    try {
      const res = await fetchProductById(payload)
      console.log(res)
      return { success: true, data: res.data.data }
    } catch (err) {
      console.log('Product fetch failed', err)
      return {
        success: false,
        message: err.response?.data?.message || 'Product fetch failed',
      }
    }
  }

  const fetchProductTransactions = async (payload) => {
    try {
      const res = await fetchAllTransactionsOnAProduct(payload)
      console.log(res)
      return { success: true, data: res.data.data }
    } catch (err) {
      console.log('Transaction fetch failed', err)
      return {
        success: false,
        message: err.response?.data?.message || 'Transaction fetch failed',
      }
    }
  };

  const fetchVariants = async (payload) => {
    try {
      const res = await fetchProductVariants(payload)
      console.log(res)
      return { success: true, data: res.data.data }
    } catch (err) {
      console.log('Variants fetch failed', err)
      return {
        success: false,
        message: err.response?.data?.message || 'Variants fetch failed',
      }
    }
  };

  const createVariant = async (id, payload) => {
    try {
      const res = await createNewProductVariant(id, payload)
      console.log(res)
      return { success: true, data: res.data.data }
    } catch (err) {
      console.log('Creation failed', err)
      return {
        success: false,
        message: err.response?.data?.message || 'Creation failed',
      }
    }
  };

  return {
    fetchProducts,
    createProduct,
    updateProduct,
    fetchProductId,
    fetchProductTransactions,
    fetchVariants,
    createVariant,
  }
}
