import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/modules/user'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      component: () => import('@/views/login/LoginPage.vue') //登录页面
    },
    {
      path: '/',
      component: () => import('@/views/layout/LayoutContainer.vue'), //架子页面
      redirect: '/artical/manage',
      children: [
        {
          path: '/artical/manage',
          component: () => import('@/views/artical/ArticalManage.vue') //文章管理
        },
        {
          path: '/artical/channel',
          component: () => import('@/views/artical/ArticalChannel.vue') //文章频道
        },
        {
          path: '/user/profile',
          component: () => import('@/views/user/UserProfile.vue') //个人信息
        },
        {
          path: '/user/avatar',
          component: () => import('@/views/user/UserAvatar.vue') //更改头像
        },
        {
          path: '/user/password',
          component: () => import('@/views/user/UserPassword.vue') //重置密码
        }
      ]
    }
  ]
})

//登录拦截访问
router.beforeEach((to) => {
  // 如果没有token, 且访问的是非登录页，拦截到登录，其他情况正常放行
  const useStore = useUserStore()
  if (!useStore.token && to.path !== '/login') return '/login'
})
export default router
