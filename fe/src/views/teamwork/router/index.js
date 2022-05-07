import project from './modules/project';
import task from './modules/task';
import taskReport from './modules/task-report';
import home from './modules/home';

export default {
    path: 'teamwork',
    component: () => import(/*webpackChunkName: 'pc-teamwork'*/ '@layout/frame'),
    children: [
        project,
        task,
        taskReport,
        home,
    ]
}
