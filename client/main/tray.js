var { Menu, Tray, BrowserWindow, app } = require('electron');
var path = require('path');

const package = require('../package.json');
 
// 创建拖盘
var iconTray = new Tray(path.join(__dirname, '../render/public/static/256.png'));
 
// 鼠标悬停托盘提示
iconTray.setToolTip(package.productName);
 
// 配置右键菜单
var trayMenu = Menu.buildFromTemplate([
    {
        label: '退出',
        click: function () {
            if (process.platform !== 'darwin') {
                app.quit();
            }
        },
    },
]);

// 绑定右键菜单到托盘
iconTray.setContextMenu(trayMenu);

var win;
 
setTimeout(function(){
    win = BrowserWindow.getFocusedWindow();
    // 点击关闭按钮让应用保存在托盘
    win.on('close', (e) => {
        if (!win.isFocused()) {
            win = null;
        } else {
            // 阻止窗口的关闭事件
            e.preventDefault();  
            win.hide();
        }
    });
})
 
 
// 任务栏图标双击托盘打开应用
iconTray.on('double-click', function () {
    win.show();
});
 
// 消息提示
// var count = 0;
// var timer = setInterval(function () {
//     count++;
//     if (count % 2 == 0) {
//         iconTray.setImage(path.join(__dirname,'render/public/static/logo.png'));
//     } else {
//         iconTray.setImage(path.join(__dirname,'render/public/static/logo.png'));
//     }
// }, 500);