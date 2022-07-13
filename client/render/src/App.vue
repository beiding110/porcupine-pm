<template>
    <div id="app">
        <header class="head">
            <div class="container">
                <div class="icon">
                    <img src="static/logo.png" alt="">

                    <div class="title">por-pm</div>
                </div>

                <div class="menu">
                    
                </div>
            </div>

            <div class="btns">
                <div class="btn-item minisize" @click="minisizeWin">
                    <icon-mini></icon-mini>
                </div>

                <div 
                    class="btn-item" 
                    @click="triggerSize"
                >
                    <icon-max v-if="!isMax"></icon-max>
                    <icon-resize v-if="isMax"></icon-resize>
                </div>

                <div class="btn-item close" @click="closeWin">
                    <icon-close></icon-close>
                </div>
            </div>
        </header>

        <div class="body">
            <!-- <webview 
                id="view" 
                :src="defaultPage"
                allowpopups
                disablewebsecurity
                nodeintegration
                preload="file://static/preload/webview.js"
            ></webview> -->
        </div>
    </div>
</template>

<script>
import IconMini from './components/icon/minisize.vue';
import IconClose from './components/icon/close.vue';
import IconMax from './components/icon/maxsize.vue';
import IconResize from './components/icon/resize.vue';

import storage from './js/storage.js';

export default {
    name: "App",
    components: {
        IconMini,
        IconMax,
        IconClose,
        IconResize,
    },
    data() {
        return {
            isMax: false,

            userinfo: false,
        };
    },
    methods: {
        minisizeWin() {
            window.remote.getCurrentWindow().minimize();
        },
        triggerSize() {
            const win = window.remote.getCurrentWindow(),
                state = win.isMaximized();

            if (state) {
                win.restore();
            } else {
                win.maximize();
            }
        },
        closeWin() {
            window.ipcRenderer.send('before-close');
        },
    },
    mounted() {
        window.addEventListener('online', () => {
            alert('网络畅通');

            let wb = document.querySelector('#view');
            wb.reload();
        });

        window.addEventListener('offline', () => {
            alert('网络连接失败，请保证使用期间网络连接状态畅通');
        });

        window.ipcRenderer.on('before-close-done', (e) => {
            window.remote.getCurrentWindow().close();
        });

        window.ipcRenderer.on('maximize', (e) => {
            this.isMax = true;
        });

        window.ipcRenderer.on('unmaximize', (e) => {
            this.isMax = false;
        });

        window.ipcRenderer.on('login', (e, data) => {
            console.log('login in app');

            this.userinfo = data;
            storage.setLocal('userinfo', data);
        });

        window.ipcRenderer.on('logout', () => {
            console.log('logout in app');

            this.userinfo = false;
            storage.setLocal('userinfo', '');
        });
    },
};
</script>

<style lang="scss" scoped>
$headHeight: 40px;
$mainColor: #003d4d;
$textColor: white;

.head{
    height: $headHeight;
    line-height: $headHeight;
    display: flex;
    padding-left: 10px;
    cursor: default;
    background: $mainColor;
    color: $textColor;
    overflow: hidden;

    .container{
        display: flex;
        flex: 1;
        -webkit-app-region: drag;
        font-size: 13px;

        .icon{
            display: flex;
            align-items: center;
            justify-items: center;

            img{
                height: 20px;
                margin-right: 8px;
            }

            .title{
                font-size: 16px;
                font-weight: bold;
            }
        }

        .menu{
            
        }
    }

    .btns{
        .btn-item{
            display: inline-block;
            padding: 0 .8em;
            transition: all .1s;
            font-size: 14px;

            &:hover{
                color: white;
                background: rgba(0, 0, 0, .1);
            }

            &.close:hover{
                background: red;
            }
        }
    }
}

.body{
    height: calc(100% - $headHeight);
    overflow: hidden;

    #view{
        display: inline-flex;
        width: 100%;
        height: 100%;
    }
}
</style>
