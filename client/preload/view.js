const { ipcRenderer, contextBridge, } = require('electron');

const package = require('../package.json');

var ecenter = {};

contextBridge.exposeInMainWorld('electronApi', {
    addEventListener: (ename, handler) => {
        ecenter[ename] = handler
    },
    removeEventListener: (ename) => {
        ecenter[ename] = null;
    },
    dispatch: (ename, data) => {
        ipcRenderer.send('view-main', {
            name: ename,
            data,
        });
    },
    getE() {
        return ecenter;
    },
    version: package.version,
});

console.log('proload of view injected');

ipcRenderer.on('before-close', (e) => {
    let beforeClose = ecenter['beforeClose'];

    if (beforeClose && typeof beforeClose === 'function') {
        beforeClose(() => {
            e.sender.send('before-close-done');
        })

        return;
    }

    e.sender.send('before-close-done');
});

ipcRenderer.on('main-view', (e, data) => {
    var ename = data.name,
        handler = ecenter[ename];

    if (handler && typeof handler === 'function') {
        handler();
    }
});