export var project = [
    {
        path: 'taskreport',
        component: () => import(/*webpackChunkName: 'pc-tw-taskreport'*/ '@views/teamwork/task-report/list-project'),
        meta: {
            title: '工时统计',
        }
    },
];
