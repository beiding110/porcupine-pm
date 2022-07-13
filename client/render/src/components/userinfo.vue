<template>
    <div class="userinfo">
        <div class="name">
            {{reName}}
        </div>

        <div class="btn" @click="clickHandler">
            退出
        </div>
    </div>
</template>

<script>
export default {
    props: {
        name: {
            type: String,
            default: '17777777777',
        },
    },
    computed: {
        reName() {
            if (this.name) {
                var nameArr = this.name.split('');

                nameArr.splice(3, 4, '****');

                return nameArr.join('');
            }

            return '-'
        },
    },
    methods: {
        clickHandler() {
            window.ipcRenderer.send('main-view', {
                name: 'logout',
            });
        },
    },
};
</script>

<style lang="scss" scoped>
    .userinfo{
        display: inline-block;
        margin-right: 18px;

        .name{
            display: inline-block;
            font-size: 16px;
        }

        .btn{
            display: inline-block;
            font-size: 12px;
            margin-left: 10px;

            &:hover{
                font-weight: bold;
            }
        }
    }
</style>