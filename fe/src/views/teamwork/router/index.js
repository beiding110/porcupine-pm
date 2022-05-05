import project from './modules/project';
import task from './modules/task';
import taskReport from './modules/task-report';

export default {
    path: 'teamwork',
    component: () => import(/*webpackChunkName: 'pc-teamwork'*/ '@layout/frame'),
    children: [
        project,
        task,
        taskReport,
    ]
}
