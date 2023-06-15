export var project = [
    {
        path: 'gantt',
        component: () => import(/*webpackChunkName: 'pc-tw-gantt'*/ '@sub/teamwork/gantt/main'),
        meta: {
            title: '甘特图',
        },
    },
];
