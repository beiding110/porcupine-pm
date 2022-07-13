// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
// const ele = require('electron');
const remote = require('@electron/remote');
const {ipcRenderer} = require('electron');

window.remote = remote;
window.ipcRenderer = ipcRenderer;