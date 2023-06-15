<template>
    <div class="group-item" :class="{state}">
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
                    <div class="dot-state" :style="{background:stateColor,}"></div>
                    {{stateTitle}}
                    ({{data.task.length}})
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
            v-if="!state && dropDown.length"
            class="dropdown"
            >
                <dropdown-menu 
                    :data="dropDown"
                ></dropdown-menu>
            </div>
        </card>

        <div class="body" :class="{empty: !data.task || !data.task.length,}">
            <draggable 
            v-model="data.task" 
            group="tasks"
            :move="dragMoveHandler"
            @change="dragEndHandler"
            >
                <task-item
                    v-for="(item, index) in data.task"
                    :key="index"
                    :data="item"
                    @reload="$emit('reload')"
                    :proinfo="proinfo"
                ></task-item>
            </draggable>
        </div>

        <div 
        v-if="!state"
        v-auth="'task-edit'"
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
import {checkAuthInArr} from '@js/authority';

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
            type: [Boolean, String, Number],
            default: false,
        },
        proinfo: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            dropDown: checkAuthInArr([
                {
                    text: '重命名',
                    command: 'edit',
                    handler: () => {
                        this.editHandler();
                    },
                    auth: 'task-group-edit',
                },
                {
                    text: '删除',
                    command: 'del',
                    handler: () => {
                        this.delHandler();
                    },
                    auth: 'task-group-del'
                },
            ]),
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
        stateColor() {
            return STATE_CONFIG[this.data.state].color;
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
                    auth: 'task-group-edit',
                },
                {
                    label: '归档已完成的',
                    onClick: () => {
                        showConfirm('归档后，该任务在项目中不可操作', '', () => {
                            this.fileHandler();
                        });
                    },
                    divided: true,
                    auth: 'task-file',
                },
                {
                    label: '删除',
                    onClick: () => {
                        showConfirm('确认以删除', '', () => {
                            this.delHandler();
                        });
                    },
                    auth: 'task-group-del',
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
                        auth: 'task-file',
                    },
                ];
            }

            items = checkAuthInArr(items);

            if (!items.length) {
                return;
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
        dragMoveHandler(e) {
            var {statelimit} = e.draggedContext.element,
                targetState = e.relatedContext.component.$parent.state;

            if (statelimit) {
                // 只能拖动到任务状态限制之后的状态
                return Number(targetState) >= Number(statelimit);
            }
            
            return true;
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
        }

        & > .foot{
            
        }

        & > .body, & > .foot{
            margin-top: 10px;

            &.empty{
                margin-top: 0;
            }
        }

        &.state {
            & > .head{
                cursor: default;

                .left{
                    .title {
                        display: block;

                        .dot-state{
                            display: inline-block;
                            width: 10px;
                            height: 10px;
                            border-radius: 50%;
                            margin-right: 4px;
                        }
                    }
                }
            }

            & > .body{
                max-height: calc(100% - 60px);
            }
        }
    }
</style>