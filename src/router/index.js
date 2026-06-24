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
        // AI自动组卷
        {
          path: '/auto-complete',
          component: () => import('@/views/AutoComplete/AutoComplete.vue'),
        },
        {
          path: '/auto-complete/select-object',
          component: () => import('@/views/AutoComplete/SelectObject.vue'),
        },
        {
          path: '/auto-complete/done',
          component: () => import('@/views/AutoComplete/Done.vue'),
        },
        {
          path: '/auto-complete/unit-review',
          component: () => import('@/views/AutoComplete/UnitReview.vue'),
        },
        {
          path: '/auto-complete/layer-work',
          component: () => import('@/views/AutoComplete/LayerWork.vue'),
        },
        {
          path: '/auto-complete/monitor-go',
          component: () => import('@/views/AutoComplete/MonitorGo.vue'),
        },
        {
          path: '/auto-complete/custom',
          component: () => import('@/views/AutoComplete/Custom.vue'),
        },
        // 试卷列表
        {
          path: '/paper-list',
          component: () => import('@/views/PaperManage/PaperList.vue'),
        },
        {
          path: '/paper-list/paper-edit/:id',
          component: () => import('@/views/PaperManage/PaperEdit.vue'),
        }
      ]
    }
  ]
})

export default router
