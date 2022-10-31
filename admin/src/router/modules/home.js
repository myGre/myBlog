import { Layout } from '@/router/constant';
const homeRouter = [
  {
    path: '/home',
    redirect: '/home/index',
    component: Layout,
    children: [
      {
        path: '/home/index',
        component: () => import('@/view/home/index.vue'),
        meta: {
          role: [1, 2],
          title: '首页',
          icon: 'icon-shouye'
        }
      },
    ],
    meta: {
      role: [1, 2],
      title: '首页',
      icon: 'icon-shouye'
    }
  },
]

export default homeRouter;