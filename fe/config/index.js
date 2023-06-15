module.exports = {
    devServer: {
        port: '8080',
        open: true,
        proxy: {
            '/pm': {
                target: 'http://127.0.0.1:3000',
                changeOrigin: true,
                pathRewrite: {
                    '^/pm': '/'
                }
            }
        },
    },
    assetsDir: 'static',

    // 项目功能配置
    'project-type': 'pc',
    
    ui: {
        element: true,
        mint: false
    },

    //ajax类型axios或jquery，用法相同
    ajax: 'axios',

    sentry: {
        dsn: '',
        enabled: false
    },
}