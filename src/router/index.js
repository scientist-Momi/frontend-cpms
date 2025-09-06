import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

import DashboardLayout from '@/layouts/DashboardLayout.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'

const Dashboard = () => import('@/views/analytics/pages/DashboardView.vue')
const Customers = () => import('@/views/customer/pages/CustomersView.vue')
const Products = () => import('@/views/product/pages/ProductsView.vue')
const NewProduct = () => import('@/views/product/pages/NewProductView.vue')
const Product = () => import('@/views/product/pages/ProductView.vue')
const ProductAnalytics = () => import('@/views/product/pages/ProductAnalyticsView.vue')
const Users = () => import('@/views/user/pages/UsersView.vue')
const Transactions = () => import('@/views/transaction/pages/TransactionsView.vue')
const Transaction = () => import('@/views/transaction/pages/TransactionView.vue')
const NewTransaction = () => import('@/views/transaction/pages/NewTransactionView.vue')
const Login = () => import('@/views/auth/pages/LoginView.vue')
const Unauthorised = () => import('@/views/UnauthorisedView.vue')
const Settings = () => import('@/views/analytics/pages/SettingsView.vue')
const NewUser = () => import('@/views/user/pages/NewUserView.vue')
const User = () => import('@/views/user/pages/UserView.vue')
const Customer = () => import('@/views/customer/pages/CustomerView.vue')
const NewCustomer = () => import('@/views/customer/pages/NewCustomerView.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [

    {
      path: '/',
      component: AuthLayout,
      children: [
        {
          path: '',
          name: 'Login',
          component: Login,
        },
      ],
    },
    {
      path: '/app',
      component: DashboardLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: 'overview',
          name: 'Dashboard',
          meta: { title: 'Dashboard' },
          component: Dashboard,
        },
        {
          path: 'customers',
          name: 'Customers',
          meta: { requiresAuth: true, permission: 'VIEW_CUSTOMER', title: 'Customers' },
          component: Customers,
          children: [
            {
              path: 'new',
              name: 'NewCustomer',
              meta: { requiresAuth: true, permission: 'CREATE_CUSTOMER', title: 'New Customer' },
              component: NewCustomer,
            },
            {
              path: 'edit/:id',
              name: 'EditCustomer',
              meta: { requiresAuth: true, permission: 'UPDATE_CUSTOMER', title: 'Edit Customer' },
              component: NewCustomer,
            },
            {
              path: ':id',
              name: 'CustomerView',
              meta: { requiresAuth: true, permission: 'VIEW_CUSTOMER', title: 'Customer Details' },
              component: Customer,
            },
          ],
        },
        {
          path: 'products',
          name: 'Products',
          meta: { requiresAuth: true, permission: 'VIEW_PRODUCT', title: 'Products' },
          component: Products,
          children: [
            {
              path: 'new',
              name: 'NewProduct',
              meta: { requiresAuth: true, permission: 'CREATE_PRODUCT', title: 'New Product' },
              component: NewProduct,
            },
            {
              path: 'edit/:id',
              name: 'EditProduct',
              meta: { requiresAuth: true, permission: 'UPDATE_PRODUCT', title: 'Edit Product' },
              component: NewProduct,
            },
            {
              path: ':id',
              name: 'ProductView',
              meta: { requiresAuth: true, permission: 'VIEW_PRODUCT', title: 'Product Details' },
              component: Product,
              children: [
                {
                  path: 'analytics',
                  name: 'ProductAnalytics',
                  meta: {
                    requiresAuth: true,
                    permission: 'VIEW_PRODUCT',
                    title: 'Product Analytics',
                  },
                  component: ProductAnalytics,
                },
              ],
            },
          ],
        },
        {
          path: 'users',
          name: 'Users',
          meta: { requiresAuth: true, permission: 'VIEW_USER', title: 'Users' },
          component: Users,
          children: [
            {
              path: 'new',
              name: 'NewUser',
              meta: { requiresAuth: true, permission: 'CREATE_USER', title: 'New User' },
              component: NewUser,
            },
            {
              path: ':id',
              name: 'UserView',
              meta: { requiresAuth: true, permission: 'VIEW_USER', title: 'User Details' },
              component: User,
            },
          ],
        },
        {
          path: 'transactions',
          name: 'Transactions',
          meta: { requiresAuth: true, permission: 'VIEW_TRANSACTION', title: 'Transactions' },
          component: Transactions,
          children: [
            {
              path: 'new',
              name: 'NewTransaction',
              meta: {
                requiresAuth: true,
                permission: 'CREATE_TRANSACTION',
                title: 'New Transaction',
              },
              component: NewTransaction,
            },
            {
              path: ':id',
              name: 'TransactionView',
              meta: {
                requiresAuth: true,
                permission: 'VIEW_TRANSACTION',
                title: 'Transaction Details',
              },
              component: Transaction,
            },
          ],
        },
        {
          path: 'settings',
          name: 'Settings',
          // meta: { requiresAuth: true, permission: 'VIEW_TRANSACTION'},
          component: Settings,
        },
        {
          path: 'unauthorised',
          name: 'Unauthorised',
          component: Unauthorised,
        },
      ],
    },
  ],
})

router.beforeEach((to, from, next) => {
  const store = useAuthStore()

  if (to.meta.requiresAuth && !store.isAuthenticated) {
    return next('/')
  }

  if (to.meta.permission && !store.hasPermission(to.meta.permission)) {
    return next('/app/unauthorised')
  }

  next()
})

export default router
