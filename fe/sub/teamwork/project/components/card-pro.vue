<template>
    <div 
    class="card-pro"
    @click="goto(`/teamwork/${data._id}/task`)"
    @contextmenu.prevent="contextMenuHandler"
    >
        <div class="cover" :style="{background:`${themeColor}`}">
            {{coverText}}
        </div>
        <div class="footer">
            <div class="name">
                {{data.proname}}
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
import {checkAuthInArr} from '@js/authority';

export default {
    components: {
        DropdownMenu,
    },
    props: {
        data: {
            type: Object,
            default: () => ({
                proname: '默认项目'
            }),
        },
    },
    data() {
        return {
            dropDown: checkAuthInArr([
                {
                    text: '编辑',
                    command: 'edit',
                    handler: () => {
                        this.editHandler();
                    },
                    auth: 'project-edit',
                },
                {
                    text: '工时统计',
                    command: 'taskreport',
                    handler: () => {
                        this.goto(`/teamwork/${this.data._id}/taskreport`);
                    },
                },
                {
                    text: '删除',
                    command: 'del',
                    handler: () => {
                        this.delHandler();
                    },
                    auth: 'project-del',
                },
            ]),
        };
    },
    computed: {
        coverText() {
            return this.data.proname.slice(0, 1);
        },
        themeColor() {
            if (this.data.covercolor) {
                return this.data.covercolor;
            }

            var id = this.data._id
            return `#${id.slice(5, 9)}${id.slice(-2, id.length)}`;
        },
    },
    methods: {
        contextMenuHandler(event) {
            var items = checkAuthInArr([
                {
                    label: '编辑',
                    onClick: () => {
                        this.editHandler();
                    },
                    auth: 'project-edit',
                },
                {
                    label: '工时统计',
                    onClick: () => {
                        this.goto(`/teamwork/${this.data._id}/taskreport`);
                    },
                },
                {
                    label: '删除',
                    onClick: () => {
                        showConfirm('确认以删除', '', () => {
                            this.delHandler();
                        });
                    },
                    auth: 'project-del',
                },
            ]);

            this.$contextmenu({
                items,
                x: event.clientX,
                y: event.clientY,
            });

            return false;
        },
        editHandler() {
            this.$emit('edit');
        },
        delHandler() {
            this.$post('/project/del', {
                procode: this.data._id,
            }, () => {
                showMsg('删除成功');

                this.$emit('reload');
            });
        },
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