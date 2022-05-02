<template>
    <div class="group-item">
        <card 
        class="head"
        @contextmenu.prevent.native="contextMenuHandler"
        >
            <div class="left">
                <el-tooltip 
                :content="data.title" 
                placement="top"
                >
                    <div class="title">
                        {{data.title}}
                    </div>
                </el-tooltip>

                <el-tooltip 
                :content="dataContent" 
                placement="top"
                >
                    <div class="data">
                        <div class="todo">
                            {{data.todo}}
                        </div>
                        <div class="no-start">
                            {{data.noStart}}
                        </div>
                        <div class="doing">
                            {{data.doing}}
                        </div>
                        <div class="done">
                            {{data.done}}
                        </div>
                    </div>
                </el-tooltip>
            </div>

            <div class="dropdown">
                <dropdown-menu 
                    :data="dropDown"
                ></dropdown-menu>
            </div>
        </card>

        <div class="body" v-if="data.task && data.task.length">
            <draggable v-model="data.task" group="tasks">
                <task-item
                    v-for="(item, index) in data.task"
                    :key="index"
                    :data="item"
                    @reload="$emit('reload')"
                ></task-item>
            </draggable>
        </div>

        <div class="foot">
            <task-add
                :groupcode="data._id"
                @reload="$emit('reload')"
            ></task-add>
        </div>
    </div>
</template>

<script>
import DropdownMenu from '@components-sys/dropdown-menu';
import Card from './card';
import TaskItem from './task-item';
import TaskAdd from './task-add';
import Draggable from 'vuedraggable';

export default {
    components: {
        DropdownMenu,
        Card,
        TaskItem,
        TaskAdd,
        Draggable,
    },
    props: {
        data: {
            type: Object,
            default: () => ({
                // title: '默认分组',
                // todo: 0,
                // noStart: 0,
                // doing: 0,
                // done: 0,
                // task: [
                //     {
                //         title: '任务1',
                //         state: 0,
                //         starttime: '2022/4/28',
                //         endtime: '2022/4/29',
                //         duration: 8,
                //         level: 'h',
                //         people: [
                //             {
                //                 name: 'yzh'
                //             },
                //         ]
                //     },
                //     {
                //         title: '任务2',
                //         state: 0,
                //         starttime: '2022/4/28',
                //         endtime: '2022/4/29',
                //         duration: 8,
                //         level: 'h',
                //         people: [
                //             {
                //                 name: 'yzh'
                //             },
                //         ]
                //     },
                //     {
                //         title: '任务3',
                //         state: 0,
                //         starttime: '2022/4/28',
                //         endtime: '2022/4/29',
                //         duration: 8,
                //         level: 'h',
                //         people: [
                //             {
                //                 name: 'yzh'
                //             },
                //         ]
                //     },
                // ],
            }),
        },
    },
    data() {
        return {
            dropDown: [
                {
                    text: '重命名',
                    command: 'edit',
                    handler: () => {
                        // TODO: 编辑操作
                        this.editHandler();
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
        dataContent() {
            return `待办：${this.data.todo} 未开始：${this.data.noStart} 进行中：${this.data.doing} 已完成：${this.data.done}`
        },
    },
    methods: {
        contextMenuHandler(event) {
            this.$contextmenu({
                items: [
                    {
                        label: '重命名',
                        onClick: () => {
                            this.editHandler();
                        },
                        divided: true,
                    },
                    {
                        label: '删除',
                        onClick: () => {
                            showConfirm('确认以删除', '', () => {
                                this.delHandler();
                            });
                        }
                    },
                ],
                x: event.clientX,
                y: event.clientY,
            });

            return false;
        },
        editHandler() {
            this.$prompt('分组名称', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputValue: this.data.title,
                inputValidator(val) {
                    if (!val) {
                        return '请输入分组名称';
                    }

                    return true;
                }
            }).then(({ value }) => {
                this.$post('/taskgroup/form', {
                    ...this.data,
                    title: value,
                }, () => {
                    showMsg('分组重命名成功');

                    this.$emit('reload');
                });
            });
        },
        delHandler() {
            this.$post('/taskgroup/del', this.data, () => {
                showMsg('分组删除成功');

                this.$emit('reload');
            });
        },
    },
}
</script>

<style lang="scss" scoped>
    @import '@css/var.scss';

    .group-item{
        display: inline-block;
        width: 280px;
        height: 100%;
        vertical-align: top;

        & + .group-item{
            margin-left: 20px;
        }

        & > .head{
            cursor: move;
            display: flex;

            .left{
                flex: 1;

                .title, .data{
                    display: inline-block;
                }

                .title{
                    max-width: 160px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
            }

            .data{
                margin-left: 1em;
                overflow: hidden;

                div{
                    float: left;

                    + div:before{
                        content: '/';
                    }

                    &.todo{
                        color: $infoColor;
                    }
                    &.no-start{
                        color: $warningColor;
                    }
                    &.doing{
                        color: $primaryColor;
                    }
                    &.done{
                        color: $successColor;
                    }
                }
            }
        }

        & > .body{
            max-height: calc(100% - 110px);
            overflow-y: auto;
        }

        & > .foot{
            
        }

        & > .body, & > .foot{
            margin-top: 10px;
        }
    }
</style>