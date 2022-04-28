export default {
    path: 'project',
    redirect: 'project/list',
    component: () => import(/*webpackChunkName: 'pc-tw-project'*/ '@layout/empty'),
    children: [
        {
            path: 'list',
            component: () => import(/*webpackChunkName: 'pc-tw-project'*/ '@views/teamwork/project/list'),
            meta: {
                title: '项目列表',
                tagNav: true,
            }
        },
    ]
}
