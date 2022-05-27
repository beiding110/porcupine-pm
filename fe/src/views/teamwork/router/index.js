import project from './modules/project';
import task from './modules/task';
import taskReport from './modules/task-report';
import home from './modules/home';
import file from './modules/file';
import gantt from './modules/gantt';

export default {
    path: 'teamwork',
    component: () => import(/*webpackChunkName: 'pc-teamwork'*/ '@layout/frame'),
    children: [
        project,
        ...task,
        taskReport,
        home,
        file,
        gantt,
    ]
}
