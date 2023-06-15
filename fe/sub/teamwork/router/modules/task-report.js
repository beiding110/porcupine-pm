export var project = [
    {
        path: 'taskreport',
        component: () => import(/*webpackChunkName: 'pc-tw-taskreport'*/ '@sub/teamwork/task-report/list-project'),
        meta: {
            title: '工时统计',
        }
    },
];

export var independent = {
    path: 'taskreport',
    redirect: 'taskreport/monthly',
    component: () => import(/*webpackChunkName: 'pc-tw-taskreport'*/ '@layout/empty'),
    children: [
        {
            path: 'monthly',
            component: () => import(/*webpackChunkName: 'pc-tw-taskreport'*/ '@sub/teamwork/task-report/monthly'),
            meta: {
                title: '日报',
            },
        },
    ],
};