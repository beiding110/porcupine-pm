exports.vue = {
    devServer: {
        port: '8080',
        open: true,
        proxy: {
            '/': {
                target: 'http://www.hgchzx.com',
                changeOrigin: true,
                pathRewrite: {
                    '^/': '/'
                }
            }
        },
    }
}

exports.project = {
    'project-type': 'pc',

    assetsDir: 'static',
    
    ui: {
        element: true,
        mint: false
    },

    router: {
        'base-name': '',
        title: '项目管理'
    },

    //ajax类型axios或jquery，用法相同
    ajax: 'jquery',

    sentry: false,

    cnzz: false,
}