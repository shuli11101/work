import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/home',
      component: () => import('@/components/Layout.vue'),
      children: [
        {
          path: '/home',
          component: () => import('@/views/Home.vue')
        },
        {
          path: '/auto-complete',
          component: () => import('@/views/AutoComplete.vue'),
        }
      ]
    }
  ]
})

export default router
