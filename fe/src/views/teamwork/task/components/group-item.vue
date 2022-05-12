<template>
    <div class="group-item">
        <card 
        class="head"
        @contextmenu.prevent.native="contextMenuHandler"
        >
            <div class="left">
                <el-tooltip 
                v-if="!state"
                :content="data.title" 
                placement="top"
                >
                    <div class="title">
                        {{data.title}}
                    </div>
                </el-tooltip>

                <div 
                v-else
                class="title"
                >
                    {{stateTitle}}
                </div>

                <el-tooltip 
                v-if="!state"
                :content="dataContent" 
                placement="top"
                >
                    <div class="data">
                        <div class="todo">
                            {{num[0]}}
                        </div>
                        <div class="no-start">
                            {{num[1]}}
                        </div>
                        <div class="doing">
                            {{num[2]}}
                        </div>
                        <div class="done">
                            {{num[3]}}
                        </div>
                    </div>
                </el-tooltip>
            </div>

            <div 
            v-if="!state"
            class="dropdown"
            >
                <dropdown-menu 
                    :data="dropDown"
                ></dropdown-menu>
            </div>
        </card>

        <div class="body state" :class="{empty: !data.task || !data.task.length}">
            <draggable 
            v-model="data.task" 
            group="tasks"
            @change="dragEndHandler"
            >
                <task-item
                    v-for="(item, index) in data.task"
                    :key="index"
                    :data="item"
                    @reload="$emit('reload')"
                ></task-item>
            </draggable>
        </div>

        <div 
        v-if="!state"
        class="foot"
        >
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

import STATE_CONFIG from '../config/state';

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
                // ],
            }),
        },
        state: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            dropDown: [
                {
                    text: '重命名',
                    command: 'edit',
                    handler: () => {
                        this.editHandler();
                    },
                },
                {
                    text: '删除',
                    command: 'del',
                    handler: () => {
                        this.delHandler();
                    },
                },
            ],
        };
    },
    computed: {
        dataContent() {
            return `待办：${this.num[0]} 未开始：${this.num[1]} 进行中：${this.num[2]} 已完成：${this.num[3]}`
        },
        num() {
            if (!this.data.task || !this.data.task.length) {
                return [0, 0, 0, 0];
            }

            return [
                this.data.task.filter(item => item.state === '0').length,
                this.data.task.filter(item => item.state === '1').length,
                this.data.task.filter(item => item.state === '2').length,
                this.data.task.filter(item => item.state === '3').length,
            ]
        },
        stateTitle() {
            return STATE_CONFIG[this.data.state].text;
        },
    },
    methods: {
        contextMenuHandler(event) {
            var items = [
                    {
                        label: '重命名',
                        onClick: () => {
                            this.editHandler();
                        },
                    },
                    {
                        label: '归档已完成的',
                        onClick: () => {
                            showConfirm('归档后，该任务在项目中不可操作', '', () => {
                                this.fileHandler();
                            });
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
                ];

            if (this.state) {
                if (this.state !== '3') {
                    return;
                }

                items = [
                    {
                        label: '归档已完成的',
                        onClick: () => {
                            showConfirm('归档后，该任务在项目中不可操作', '', () => {
                                this.fileHandler();
                            });
                        },
                    },
                ];
            }

            this.$contextmenu({
                items,
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
        dragEndHandler() {
            this.$emit('taskdrag');
        },
        // 批量归档
        fileHandler() {
            var tasks = this.data.task.filter(item => item.state === '3');

            this.$post('/task/file', tasks, () => {
                showMsg('任务状态更新成功');

                this.$emit('reload');
            }, true);
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
        margin-right: 20px;

        & + .group-item{
            
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
            max-height: calc(100% - 120px);
            overflow-y: auto;

            &.state{
                max-height: calc(100% - 60px);
            }
        }

        & > .foot{
            
        }

        & > .body, & > .foot{
            margin-top: 10px;

            &.empty{
                margin-top: 0;
            }
        }
    }
</style>