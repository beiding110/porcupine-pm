const { BrowserWindow } = require('electron');
const remote = require('@electron/remote/main');

const windowFeatures = require('../utils/windowFeatures');

const {bwUrl} = require('../config/main');

const view = require('./view.js');

remote.initialize();

function MainWindow() {
    this.init();
}

MainWindow.prototype = {
    init() {
        this.$window = null;
        this.$webContents = null;
    },
    create() {
        // Create the browser window.
        var wf = windowFeatures();

        wf.frame = false;

        this.$window = new BrowserWindow(wf);
        this.$webContents = this.$window.webContents;

        // and load the index.html of the app.
        this.$window.loadURL(bwUrl);

        // Open the DevTools.
        if (process.env.NODE_ENV === 'development') {
            this.$window.webContents.openDevTools();
        }

        remote.enable(this.$window.webContents);

        this.createView();

        this.bindEvent();
    },
    bindEvent() {
        this.$window.on('maximize', () => {
            this.$window.webContents.send('maximize');
        });

        this.$window.on('unmaximize', () => {
            this.$window.webContents.send('unmaximize');
        });
    },
    createView() {
        view.create();

        view.mount(this.$window);
    },
}

module.exports = new MainWindow();