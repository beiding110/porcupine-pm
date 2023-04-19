const path = require('path');

module.exports = function() {
    return {
        width: 1220,
        height: 800,
        minWidth: 1220,
        minHeight: 800,
        icon: path.join(__dirname, '../render/public/favicon.ico'),
        show: false,
        backgroundColor: '#fff',
        webPreferences: {
            preload: path.join(__dirname, '../preload/window.js'),
            nodeIntergration: true,
            contextIsolation: false,
        },
    };
}