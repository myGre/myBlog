import { Layout } from '@/router/constant';

const logRouter = [
  {
    path: '/log',
    name: 'log',
    component: Layout,
    children: [
      {
        path: '/log/index',
        name: 'logIndex',
        component: () => import('@/view/log/log.vue'),
        meta: {
          role: [1, 2],
          keepAlive: true,
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