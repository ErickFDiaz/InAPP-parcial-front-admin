import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/dashboard'
    },
    {
      path: '/login',
      component: () => import('../views/LoginView.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/dashboard',
      component: () => import('../views/DashboardView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/quotes',
      component: () => import('../views/QuotesView.vue'),
      meta: { requiresAuth: true }
    },
    { // Add this new route
      path: '/quotes/manage/:id',
      name: 'ManageQuote',
      component: () => import('../views/ManageQuoteView.vue'),
      meta: { requiresAuth: true },
      props: true // This allows the :id to be passed as a prop to the component
    },
    {
      path: '/employees',
      component: () => import('../views/EmployeesView.vue'),
      meta: { requiresAuth: true, requiresAdmin: true }
    }
  ]
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.meta.requiresAdmin && !authStore.isAdmin()) {
    next('/dashboard')
  } else if (to.path === '/login' && authStore.isAuthenticated) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router