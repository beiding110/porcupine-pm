<template>
    <card
    class="task-item"
    :class="data.level ? `level-${data.level}` : ''"
    @contextmenu.prevent.native="contextMenuHandler"
    >
        <div class="title">
            <div class="text">
                {{data.title}}
            </div>

            <div class="dropdown">
                <dropdown-menu 
                    :data="dropDown"
                ></dropdown-menu>
            </div>
        </div>

        <div class="body">
            <div class="state">
                <state :data="data.state"></state>
            </div>

            <div class="people">
                <people-editor 
                    readonly 
                    :value="data.people"
                ></people-editor>
            </div>
        </div>

        <div class="foot">
            <el-tag 
            v-if="data.endtime"
            class="endtime"
            size="small"
            >
                截止时间：{{data.endtime}}
            </el-tag>
        </div>

        <my-dialog 
        v-model="dialogVisible" 
        title="任务项目"
        width="700px"
        >
            <form-page
                v-if="dialogVisible"
                @cancle="dialogClose"
            ></form-page>
        </my-dialog>
    </card>
</template>

<script>
import DIALOG_LIST_MIXIN from '@mixins/dialog-list-page';

import Card from './card';
import State from './state';
import PeopleEditor from '../../project/components/people-editor';
import DropdownMenu from '@components-sys/dropdown-menu';
import FormPage from '../form';

export default {
    mixins: [DIALOG_LIST_MIXIN],
    components: {
        Card,
        State,
        PeopleEditor,
        DropdownMenu,
        FormPage,
    },
    props: {
        data: {
            type: Object,
            default: () => ({}),
        },
    },
    data() {
        return {
            dropDown: [
                {
                    text: '编辑',
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
            ]
        };
    },
    methods: {
        contextMenuHandler(event) {
            this.$contextmenu({
                items: [
                    {
                        label: '编辑',
                        onClick: () => {
                            this.editHandler();
                        },
                    },
                    {
                        label: '修改状态',
                        children: [
                            { 
                                label: "待办",
                                onClick: () => {
                                    this.shiftState(0);
                                },
                            }, 
                            { 
                                label: "未开始",
                                onClick: () => {
                                    this.shiftState(1);
                                },
                            },
                            { 
                                label: "进行中",
                                onClick: () => {
                                    this.shiftState(2);
                                },
                            },
                            { 
                                label: "已完成",
                                onClick: () => {
                                    this.shiftState(3);
                                },
                            },
                        ],
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
        delHandler() {
            // TODO: 删除接口
        },
        shiftState(state) {
            // TODO: 设置状态为
            alert(state);
        },
    },
};
</script>

<style lang="scss" scoped>
    @import '@css/var.scss';

    .task-item{
        cursor: pointer;
        box-sizing: border-box;

        &.level-h{
            border-left: 4px solid $dangerColor;
        }

        &.level-m{
            border-left: 4px solid $primaryColor;
        }

        &.level-l{
            border-left: 4px solid $infoColor;
        }

        & + .task-item{
            margin-top: 10px;
        }

        & > .body, & > .foot{
            margin-top: 10px;
        }

        & > .body{
            display: flex;
            align-items: center;

            .state{
                flex: 1;
            }
        }

        .title{
            display: flex;

            .text{
                flex: 1;
            }

            .dropdown{

            }
        }
    }
</style>