const util = require('./util.js');
const webpack = require('webpack');
const path = require('path');

const CONFIG = require('../config/index');

var baseConfig = {
    publicPath: process.env.NODE_ENV === "production" ? "./" : "/",
    assetsDir: CONFIG.project.assetsDir,
    lintOnSave: false,
    configureWebpack: config => {
        const staticFoldersPlugin = util.buildStaticPlugin(CONFIG.project.assetsDir);
        config.plugins.push.apply(config.plugins, staticFoldersPlugin);
    },
    chainWebpack: config => {
        util.forEachKey({
            'vue$': 'vue/dist/vue.esm.js',
            '@': util.resolve('src'),
            '@assets': util.resolve('src/assets'),
            '@components': util.resolve('src/components'),
            '@components-sys': util.resolve('src/components-sys'),
            '@config': util.resolve('src/config'),
            '@css': util.resolve('src/css'),
            '@js': util.resolve('src/js'),
            '@layout': util.resolve('src/layout'),
            '@mixins': util.resolve('src/mixins'),
            '@router': util.resolve('src/router'),
            '@store': util.resolve('src/store'),
            '@views': util.resolve('src/views'),
        }, function (key, value) {
            config.resolve.alias.set(key, value);
        });

        config.plugin('provide').use(webpack.ProvidePlugin, [{
            $: 'jquery',
            jquery: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery'
        }]);

        if (process.env.NODE_ENV === "production" && CONFIG.project.sentry.enabled) {
            const SentryPlugin = require('@sentry/webpack-plugin');

            config.plugin('sentry').use(SentryPlugin).tap(options => {
                options[0] = {
                    release: process.env.RELEASE_VERSION,
                    configFile: 'sentry.properties',
                    include: path.join(__dirname, `../dist/${CONFIG.project.assetsDir}/js/`),
                    urlPrefix: `~/${CONFIG.project.assetsDir}/js`
                };
                return options;
            });
        }
    },
    css: {
        loaderOptions: {
            sass: {
                implementation: require('sass'),
            },
        },
    },
};

if (CONFIG.project['project-type'] === 'mobile') {
    baseConfig.css.loaderOptions.postcss = {
        plugins: [
            require("autoprefixer")({
                // ???????????? autoprefixer
                overrideBrowserslist: ["last 15 versions"]
            }),
            require("postcss-pxtorem")({
                rootValue: 75, // ???????????????
                // ???????????????????????????????????????????????????????????????px????????????????????????UI???????????????????????????????????? selectorBlackList??????????????????
                //??????????????????????????????px????????????????????????????????? PX ??? Px ???
                selectorBlackList: ["ig", "el-"],
                propList: ["*"],
                exclude: /node_modules/
            })
        ]
    }
}

module.exports = baseConfig;