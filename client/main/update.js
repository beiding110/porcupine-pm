const { autoUpdater } = require('electron-updater');
const { dialog } = require('electron');

const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';

// 防止报错no such file or directory dev-app-update.yml
// if (IS_DEVELOPMENT) {
//     autoUpdater.updateConfigPath = path.join(__dirname, '../dist/dev-app-update.yml');
// }

// const { app, } = require('electron');

// Object.defineProperty(app, 'isPackaged', {
//     get() {
//         return true;
//     },
// });

//设置自动下载
autoUpdater.autoDownload = false;

autoUpdater.on('error', (res) => {
    console.log('error:' + res);

    // dialog
    //     .showMessageBox({
    //         message: `error:${res}`
    //     })
});

autoUpdater.on('checking-for-update', (res) => {
    console.log('checking-for-update:' + res);

    // dialog
    //     .showMessageBox({
    //         message: `checking-for-update:${res}`
    //     })
});

autoUpdater.on('update-not-available', (res) => {
    console.log('update-not-available:' + res);

    // dialog
    //     .showMessageBox({
    //         message: `update-not-available:${JSON.stringify(res)}`
    //     })
});

autoUpdater.on('update-available', (res) => {
    dialog
        .showMessageBox({
            type: 'info',
            title: '发现新的版本',
            message: '发现新版本, 马上更新?',
            buttons: ['确定', '取消'],
        })
        .then((resp) => {
            if (resp.response == 0) {
                autoUpdater.downloadUpdate();
            }
        });
});

autoUpdater.on('download-progress', (res) => {
    console.log('download-progress:' + res);
});

autoUpdater.on('update-downloaded', () => {
    dialog
        .showMessageBox({
            title: '下载完成',
            message: '最新版本已下载完成, 退出程序进行安装',
        })
        .then(() => {
            autoUpdater.quitAndInstall();
        });
});

module.exports = function () {
    // 检测是否有新版本
    autoUpdater.checkForUpdates();
};
