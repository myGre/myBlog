import { Layout } from '@/router/constant';

const logRouter = [
  {
    path: '/log',
    component: Layout,
    children: [
      {
        path: '/log/index',
        component: () => import('@/view/log/index.vue'),
        meta: {
          role: [1, 2],
          title: '操作日志',
          icon: 'icon-guanjianci'
        }
      },
    ],
    meta: {
      role: [1, 2],
      title: '操作日志',
      icon: 'icon-shouye'
    }
  },
]

export default logRouter;