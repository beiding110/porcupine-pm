export var project = [
    {
        path: 'gantt',
        component: () => import(/*webpackChunkName: 'pc-tw-gantt'*/ '@views/teamwork/gantt/main'),
        meta: {
            title: '甘特图',
        },
    },
];
