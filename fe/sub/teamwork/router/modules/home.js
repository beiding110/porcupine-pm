export default {
    path: 'home',
    alias: 'index',
    component: () => import(/*webpackChunkName: 'pc-tw-home'*/ '@sub/teamwork/home/index'),
    meta: {
        title: '首页',
        tagNav: true,
    },
}
