export default {
    path: ':procode/task',
    redirect: ':procode/task/index',
    component: () => import(/*webpackChunkName: 'pc-tw-task'*/ '../../layout/project'),
    children: [
        {
            path: 'index',
            component: () => import(/*webpackChunkName: 'pc-tw-task'*/ '@views/teamwork/task/index'),
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
    ]
}
