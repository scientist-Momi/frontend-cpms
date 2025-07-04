// src/constants/permissions.js

export const PERMISSION_GROUPS = [
  {
    group: 'User Management',
    permissions: [
      {
        key: 'CREATE_USER',
        label: 'Create User',
        description: 'Allows you to add new users to the system.',
      },
      {
        key: 'VIEW_USER',
        label: 'View User',
        description: 'Allows you to view user profiles and information.',
      },
      {
        key: 'UPDATE_USER',
        label: 'Update User',
        description: 'Allows you to edit existing user details.',
      },
      {
        key: 'DELETE_USER',
        label: 'Delete User',
        description: 'Allows you to remove users from the system.',
      },
    ],
  },
  {
    group: 'Customer Management',
    permissions: [
      {
        key: 'CREATE_CUSTOMER',
        label: 'Create Customer',
        description: 'Allows you to add new customers.',
      },
      {
        key: 'VIEW_CUSTOMER',
        label: 'View Customer',
        description: 'Allows you to view customer information.',
      },
      {
        key: 'UPDATE_CUSTOMER',
        label: 'Update Customer',
        description: 'Allows you to edit customer details.',
      },
      {
        key: 'DELETE_CUSTOMER',
        label: 'Delete Customer',
        description: 'Allows you to remove customers.',
      },
    ],
  },
  {
    group: 'Product Management',
    permissions: [
      {
        key: 'CREATE_PRODUCT',
        label: 'Create Product',
        description: 'Allows you to add new products to the catalog.',
      },
      {
        key: 'VIEW_PRODUCT',
        label: 'View Product',
        description: 'Allows you to view product information.',
      },
      {
        key: 'UPDATE_PRODUCT',
        label: 'Update Product',
        description: 'Allows you to edit existing product details.',
      },
      {
        key: 'DELETE_PRODUCT',
        label: 'Delete Product',
        description: 'Allows you to remove products from the catalog.',
      },
    ],
  },
  {
    group: 'Transaction Management',
    permissions: [
      {
        key: 'CREATE_TRANSACTION',
        label: 'Create Transaction',
        description: 'Allows you to initiate new transactions.',
      },
      {
        key: 'VIEW_TRANSACTION',
        label: 'View Transaction',
        description: 'Allows you to view transaction records.',
      },
      {
        key: 'UPDATE_TRANSACTION',
        label: 'Update Transaction',
        description: 'Allows you to edit transaction details.',
      },
      {
        key: 'DELETE_TRANSACTION',
        label: 'Delete Transaction',
        description: 'Allows you to delete transactions.',
      },
    ],
  },
  {
    group: 'Wallet Management',
    permissions: [
      {
        key: 'VIEW_WALLET',
        label: 'View Wallet',
        description: 'Allows you to view wallet balances and history.',
      },
      {
        key: 'UPDATE_WALLET',
        label: 'Update Wallet',
        description: 'Allows you to update wallet information.',
      },
    ],
  },
]
