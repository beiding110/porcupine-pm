export default {
    path: 'login',
    alias: '/',
    component: () => import(/*webpackChunkName: 'pc-login'*/ '@views/login/index'),
    meta: {
        title: '登录'
    }
}
