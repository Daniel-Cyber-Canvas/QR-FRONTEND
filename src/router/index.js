import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/pages/Home.vue')
    },
    {
      path: '/services',
      name: 'services',
      component: () => import('@/pages/Services.vue')
    },
    {
      path: '/qr-detail',
      name: 'qr-detail',
      component: () => import('@/pages/QRDetail.vue')
    },
    {
      path: '/scan/:id',
      name: 'scan',
      component: () => import('@/pages/QRDetail.vue')
    },
    {
      path: '/qr-select',
      name: 'qr-select',
      component: () => import('@/pages/SelectQR.vue')
    },
    {
      path: '/qr-form',
      name: 'qr-form',
      component: () => import('@/pages/FormQR.vue')
    },
    {
      path: '/link-tree',
      name: 'link-tree',
      component: () => import('@/pages/LinkTree.vue')
    },
    {
      path: '/qr-management',
      name: 'qr-management',
      component: () => import('@/pages/QRManagement.vue')
    },
    {
      path: '/qrmanagement/website',
      name: 'website-qr',
      component: () => import('@/pages/qrmanagement/Website.vue')
    },
    {
      path: '/domains',
      name: 'domains',
      component: () => import('@/pages/Home.vue') // Placeholder - redirect to home for now
    },
    {
      path: '/billing',
      name: 'billing',
      component: () => import('@/pages/Home.vue') // Placeholder - redirect to home for now
    },
    {
      path: '/support',
      name: 'support',
      component: () => import('@/pages/Home.vue') // Placeholder - redirect to home for now
    },
  ]
})

export default router
