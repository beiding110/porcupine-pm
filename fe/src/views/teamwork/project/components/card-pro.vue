<template>
    <div 
    class="card-pro"
    @click="goto('/teamwork/task')"
    >
        <div class="cover">
            {{coverText}}
        </div>
        <div class="footer">
            <div class="name">
                {{data.title}}
            </div>

            <div class="dropdown">
                <dropdown-menu 
                    :data="dropDown"
                ></dropdown-menu>
            </div>
        </div>
    </div>
</template>

<script>
import DropdownMenu from '@components-sys/dropdown-menu';

export default {
    components: {
        DropdownMenu,
    },
    props: {
        data: {
            type: Object,
            default: () => ({
                title: '默认项目'
            }),
        },
    },
    data() {
        return {
            dropDown: [
                {
                    text: '编辑',
                    command: 'edit',
                    handler: () => {
                        // TODO: 编辑操作
                    },
                },
                {
                    text: '删除',
                    command: 'del',
                    handler: () => {
                        // TODO: 删除接口
                    },
                },
            ]
        };
    },
    computed: {
        coverText() {
            return this.data.title.slice(0, 1);
        },
    },
    methods: {
        
    }
};
</script>

<style lang="scss" scoped>
    @import '@css/var.scss';

    .card-pro{
        width: 260px;
        border-radius: 10px;
        overflow: hidden;
        box-shadow: 0 0 10px #ccc;
        cursor: pointer;
        margin: 10px;

        .cover{
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100px;
            background: $primaryColor;
            color: white;
            font-size: 32px;
        }

        .footer{
            display: flex;
            padding: 8px 14px;
            font-size: 12px;

            .name{
                flex: 1;
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
            }

            .el-icon-more{
                &:hover{
                    color: $primaryColor;
                    background: $infoColor3;
                    border-radius: 50%;
                }
            }
        }

        &:hover{
            box-shadow: 0 0 10px #aaa;

            .cover{
                background: $primaryColor9;
            }
        }
    }
</style>