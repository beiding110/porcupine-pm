import project from './modules/project';
import {independent as task} from './modules/task';
import home from './modules/home';
import file from './modules/file';
import {independent as taskreport} from './modules/task-report';
import settings from './modules/settings';

export default {
    path: 'teamwork',
    component: () => import(/*webpackChunkName: 'pc-teamwork'*/ '@layout/frame'),
    children: [
        home,
        task,
        file,
        settings,
        
        ...project,
        taskreport,
    ],
}
