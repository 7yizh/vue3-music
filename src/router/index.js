// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue')
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
    redirect: '/home/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard.vue')
      },
      {
        path: 'users',
        name: 'UserManagement',
        component: () => import('@/views/UserManagement.vue')
      },
      {
        path: 'settings',
        name: 'Settings',
        component: () => import('@/views/Settings.vue')
      },
      {
        path: 'inventotry',
        name: 'Inventotry',
        component: () => import('@/views/InventoryInfo/Inventory.vue')
      },
      {
        path: 'trajectory',
        name: 'Trajectory',
        component: () => import('@/views/InventoryInfo/Trajectory.vue')
      },{
        path: 'brand',
        name: 'Brand',
        component: () => import('@/views/Brand/Brand.vue')
      },{
        path: 'tools',
        name: 'Tools',
        component: () => import('@/views/Tools/Tools.vue')
      },{
        path: 'toolkits',
        name: 'Toolkits',
        component: () => import('@/views/Toolkits/Toolkits.vue')
      },
      {
        path: 'bindTools',
        name: 'BindTools',
        component: () => import('@/views/Toolkits/BindTools.vue')
      },{
        path: 'modules',
        name: 'Modules',
        component: () => import('@/views/Modules/Modules.vue')
      },{
        path: 'categories',
        name: 'Categories',
        component: () => import('@/views/Categories/Categories.vue')
      },{
        path: 'video',
        name: 'Video',
        component: () => import('@/views/Video/Video.vue')
      },{
        path: 'locationStatistics',
        name: 'LocationStatistics',
        component: () => import('@/views/Statistics/LocationStatistics.vue')
      },{
        path: 'utilzationStatistics',
        name: 'UtilzationStatistics',
        component: () => import('@/views/Statistics/UtilzationStatistics.vue')
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue')  // 可选的404页面
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('token')
  
  if (to.name !== 'Login' && !isAuthenticated) {
    next({ name: 'Login' })
  } else if (to.name === 'Login' && isAuthenticated) {
    next({ name: 'Dashboard' })
  } else {
    next()
  }
})

export default router