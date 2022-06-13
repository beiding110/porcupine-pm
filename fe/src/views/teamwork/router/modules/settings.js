export default {
    path: 'settings',
    component: () => import(/*webpackChunkName: 'pc-tw-settings'*/ '@views/teamwork/settings/index'),
    meta: {
        title: '设置管理',
        tagNav: true,
    },
}
