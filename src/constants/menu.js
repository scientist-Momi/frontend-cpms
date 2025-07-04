// constants/menu.js
export const sidebarMenu = [
    {
        title: 'Dashboard',
        icon: 'dashboard',
        route: '/app/overview',
        alwaysVisible: true,
      },
    {
      title: 'Products',
      icon: 'shopping_bag',
      route: '/app/products',
      permission: 'VIEW_PRODUCT',
      alwaysVisible: false,
    },
    // {
    //   title: 'Create Product',
    //   icon: 'add_box',
    //   route: '/products/create',
    //   permission: 'CREATE_PRODUCT',
    //   alwaysVisible: false,
    // },
    {
      title: 'Transactions',
      icon: 'receipt_long',
      route: '/app/transactions',
      permission: 'VIEW_TRANSACTION',
      alwaysVisible: false,
    },
    {
      title: 'Customers',
      icon: 'group',
      route: '/app/customers',
      permission: 'VIEW_CUSTOMER',
      alwaysVisible: false,
    },
    {
      title: 'Users',
      icon: 'group',
      route: '/app/users',
      permission: 'VIEW_USER',
      alwaysVisible: false,
    },
    // {
    //   title: 'Settings',
    //   icon: 'settings',
    //   route: '/app/settings',
    //   alwaysVisible: true,
    // },
  ]
