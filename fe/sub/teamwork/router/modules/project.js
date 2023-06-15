import {project as task} from './task';
import {project as taskreport} from './task-report';
import {project as gantt} from './gantt';

export default [
    {
        path: 'project',
        redirect: 'project/list',
        component: () => import(/*webpackChunkName: 'pc-tw-project'*/ '@layout/empty'),
        children: [
            {
                path: 'list',
                component: () => import(/*webpackChunkName: 'pc-tw-project'*/ '@sub/teamwork/project/list'),
                meta: {
                    title: '项目列表',
                    tagNav: true,
                }
            },
        ]
    },
    {
        path: ':procode',
        component: () => import(/*webpackChunkName: 'pc-tw-project'*/ '../../layout/project'),
        children: [
            ...task,
            ...taskreport,
            ...gantt,
        ],
    },
]
