import project from './modules/project';
import task from './modules/task';

export default {
    path: 'teamwork',
    component: () => import(/*webpackChunkName: 'pc-teamwork'*/ '@layout/frame'),
    children: [
        project,
        task,
    ]
}
