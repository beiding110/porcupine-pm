export default {
    path: 'task',
    redirect: 'task/index',
    component: () => import(/*webpackChunkName: 'pc-tw-task'*/ '@layout/empty'),
    children: [
        {
            path: 'index',
            component: () => import(/*webpackChunkName: 'pc-tw-task'*/ '@views/teamwork/task/index'),
            meta: {
                title: '任务管理',
            }
        },
    ]
}
