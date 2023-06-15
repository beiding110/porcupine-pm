<template>
    <el-dropdown 
    trigger="click" 
    @command="handleCommand"
    >
        <i 
            class="dropdown-menu-btn el-icon-more"
            @click.stop
        ></i>

        <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
            v-for="(item, index) in data"
            :key="index"
            :command="item.command"
            >
                {{item.text}}
            </el-dropdown-item>
        </el-dropdown-menu>
    </el-dropdown>
</template>

<script>
export default {
    props: {
        data: {
            type: Array,
            default: () => [],
        }
    },
    computed: {
        handlerMap() {
            return this.data.reduce((map, item) => {
                if (item.command === 'del') {
                    map[item.command] = () => {
                        showConfirm('确认以删除', '', () => {
                            item.handler();
                        });
                    };
                } else {
                    map[item.command] = item.handler;
                }

                return map;
            }, {})
        }
    },
    methods: {
        // 触发下拉菜单
        handleCommand(cmd) {
            var handler = this.handlerMap[cmd];

            handler && handler();
        },
    }
}
</script>

<style lang="scss" scoped>
    @import '@css/var.scss';

    .dropdown-menu-btn{
        cursor: pointer;

        &:hover{
            color: $primaryColor;
            background: $infoColor3;
            border-radius: 50%;
        }
    }
</style>