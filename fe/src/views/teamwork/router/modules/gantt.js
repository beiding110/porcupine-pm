export default {
    path: ':procode/gantt',
    redirect: ':procode/gantt/main',
    component: () => import(/*webpackChunkName: 'pc-tw-task'*/ '../../layout/project'),
    children: [
        {
            path: 'main',
            component: () => import(/*webpackChunkName: 'pc-tw-task'*/ '@views/teamwork/gantt/main'),
            meta: {
                title: '甘特图',
            }
        },
    ]
}
