export default [
    {
        path: ':procode/task',
        redirect: ':procode/task/index',
        component: () => import(/*webpackChunkName: 'pc-tw-task'*/ '../../layout/project'),
        children: [
            {
                path: 'index',
                component: () => import(/*webpackChunkName: 'pc-tw-task'*/ '@views/teamwork/task/project'),
                meta: {
                    title: '任务组',
                }
            },
            {
                path: 'state',
                component: () => import(/*webpackChunkName: 'pc-tw-task'*/ '@views/teamwork/task/state'),
                meta: {
                    title: '任务状态',
                }
            },
            {
                path: 'timeline',
                component: () => import(/*webpackChunkName: 'pc-tw-task'*/ '@views/teamwork/task/time-line'),
                meta: {
                    title: '时间轴',
                }
            },
        ]
    },
    {
        path: 'task',
        redirect: 'task/index',
        component: () => import(/*webpackChunkName: 'pc-tw-task'*/ '@layout/empty'),
        children: [
            {
                path: 'index',
                component: () => import(/*webpackChunkName: 'pc-tw-task'*/ '@views/teamwork/task/index'),
                meta: {
                    title: '活跃任务',
                },
            },
        ],
    },
];
