export default {
    path: 'file',
    redirect: 'file/list',
    component: () => import(/*webpackChunkName: 'pc-tw-file'*/ '@layout/empty'),
    children: [
        {
            path: 'list',
            component: () => import(/*webpackChunkName: 'pc-tw-file'*/ '@sub/teamwork/task/file'),
            meta: {
                title: '归档列表',
                tagNav: true,
            }
        },
    ]
}
