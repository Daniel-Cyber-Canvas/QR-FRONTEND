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
    // QR Service Routes - Virtual Card
    {
      path: '/qr/virtualcard/static',
      name: 'virtualcard-static',
      component: () => import('@/pages/qrservices/VirtualCardStatic.vue')
    },
    {
      path: '/qr/virtualcard/dynamic',
      name: 'virtualcard-dynamic',
      component: () => import('@/pages/qrservices/VirtualCardDynamic.vue')
    },
    // QR Service Routes - Website
    {
      path: '/qr/website/static',
      name: 'website-static',
      component: () => import('@/pages/qrservices/WebsiteStatic.vue')
    },
    {
      path: '/qr/website/dynamic',
      name: 'website-dynamic',
      component: () => import('@/pages/qrservices/WebsiteDynamic.vue')
    },
    // QR Service Routes - Text (Static Only)
    {
      path: '/qr/text/static',
      name: 'text-static',
      component: () => import('@/pages/qrservices/TextStatic.vue')
    },
    // QR Service Routes - Email (Static Only)
    {
      path: '/qr/email/static',
      name: 'email-static',
      component: () => import('@/pages/qrservices/EmailStatic.vue')
    },
    // QR Service Routes - SMS (Static Only)
    {
      path: '/qr/sms/static',
      name: 'sms-static',
      component: () => import('@/pages/qrservices/SMSStatic.vue')
    },
    // QR Service Routes - WiFi (Static Only)
    {
      path: '/qr/wifi/static',
      name: 'wifi-static',
      component: () => import('@/pages/qrservices/WiFiStatic.vue')
    },
    // QR Service Routes - PDF (Dynamic Only)
    {
      path: '/qr/pdf/dynamic',
      name: 'pdf-dynamic',
      component: () => import('@/pages/qrservices/PDFDynamic.vue')
    },
    // QR Service Routes - Images (Dynamic Only)
    {
      path: '/qr/images/dynamic',
      name: 'images-dynamic',
      component: () => import('@/pages/qrservices/ImagesDynamic.vue')
    },
    // QR Service Routes - Event (Dynamic Only)
    {
      path: '/qr/event/dynamic',
      name: 'event-dynamic',
      component: () => import('@/pages/qrservices/EventDynamic.vue')
    },
    // QR Service Routes - App (Dynamic Only)
    {
      path: '/qr/app/dynamic',
      name: 'app-dynamic',
      component: () => import('@/pages/qrservices/AppDynamic.vue')
    },
    // QR Service Routes - Business Page (Dynamic Only)
    {
      path: '/qr/businesspage/dynamic',
      name: 'businesspage-dynamic',
      component: () => import('@/pages/qrservices/BusinessPageDynamic.vue')
    },
    // QR Service Routes - 2D Barcode (Dynamic Only)
    {
      path: '/qr/barcode2d/dynamic',
      name: 'barcode2d-dynamic',
      component: () => import('@/pages/qrservices/Barcode2DDynamic.vue')
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
