export default {
    path: ':procode/task',
    redirect: ':procode/task/index',
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
