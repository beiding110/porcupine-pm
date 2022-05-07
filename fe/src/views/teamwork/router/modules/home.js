export default {
    path: 'home',
    alias: 'index',
    component: () => import(/*webpackChunkName: 'pc-tw-home'*/ '@views/teamwork/home/index'),
    meta: {
        title: '首页',
        tagNav: true,
    },
}
