const {ipcMain} = require('electron');

const bWindow = require('../main/window.js');
const bView = require('../main/view.js');

var beforeCloseDoneCb;

ipcMain.on('nav', (e, data) => {
    bView.$webContents.send('before-close');

    beforeCloseDoneCb = function () {
        bView.shift(data);
        bWindow.$webContents.send('nav-done', data);
    };
});

ipcMain.on('before-close-done', (e, data) => {
    beforeCloseDoneCb && beforeCloseDoneCb();
});

ipcMain.on('before-close', (e, data) => {
    bView.$webContents.send('before-close');

    beforeCloseDoneCb = function () {
        e.sender.send('before-close-done');
    };
});

// 主界面触发，作用于view
ipcMain.on('main-view', (e, data) => {
    bView.$webContents.send('main-view', data);
});

// view触发，作用于主界面
ipcMain.on('view-main', (e, data) => {
    bWindow.$webContents.send(data.name, data.data);
});