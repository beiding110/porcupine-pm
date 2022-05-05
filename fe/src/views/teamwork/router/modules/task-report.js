export default {
    path: ':procode/taskreport',
    redirect: ':procode/taskreport/list',
    component: () => import(/*webpackChunkName: 'pc-tw-taskreport'*/ '../../layout/project'),
    children: [
        {
            path: 'list',
            component: () => import(/*webpackChunkName: 'pc-tw-taskreport'*/ '@views/teamwork/task-report/list-project'),
            meta: {
                title: '工时统计',
            }
        },
    ]
}
