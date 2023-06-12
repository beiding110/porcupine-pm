<template>
    <card
    class="task-item"
    :class="data.level ? `level-${data.level}` : ''"
    @contextmenu.prevent.native="contextMenuHandler"
    >
        <div class="title">
            <pro-info-icon
                v-if="proinfo"
                class="icon"
                :data="data.procode"
            ></pro-info-icon>

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
                    :value="data.member"
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
        :title="dialogTitle"
        width="700px"
        >
            <component
                v-if="dialogVisible"
                :is="dialogComponent"
                :data="form"
                @cancle="dialogClose"
            ></component>
        </my-dialog>
    </card>
</template>

<script>
import DIALOG_LIST_MIXIN from '@mixins/dialog-list-page';
import {checkAuthInArr} from '@/js/authority';

import CONFIG_STATE from '../config/state';

import Card from './card';
import State from './state';
import PeopleEditor from '../../project/components/people-editor';
import DropdownMenu from '@components-sys/dropdown-menu';
import FormPage from '../form';
import FormPageTaskReport from '../../task-report/form';
import ProInfoIcon from '../../project/components/pro-info-icon';

export default {
    mixins: [DIALOG_LIST_MIXIN],
    components: {
        Card,
        State,
        PeopleEditor,
        DropdownMenu,
        FormPage,
        FormPageTaskReport,
        ProInfoIcon,
    },
    props: {
        data: {
            type: Object,
            default: () => ({}),
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
                    text: '编辑',
                    command: 'edit',
                    handler: () => {
                        this.dialogTitle = '编辑任务';
                        this.dialogComponent = 'form-page';
                        this.editHandler(this.data);
                    },
                    auth: 'task-edit',
                },
                {
                    text: '上报工时',
                    command: 'report',
                    handler: () => {
                        const procode = this.data.procode._id || this.$route.params.procode;

                        if (!procode) {
                            showMsg('上报工时缺失procode');
                            return;
                        }

                        this.dialogTitle = '上报工时';
                        this.dialogComponent = 'form-page-task-report';
                        this.form = {
                            procode,
                            taskcode: this.data._id,
                        };
                        this.dialogShow();
                    },
                },
                {
                    text: '删除',
                    command: 'del',
                    handler: () => {
                        this.delHandler();
                    },
                    auth: 'task-del',
                },
            ]),

            dialogTitle: '',
            dialogComponent: '',
        };
    },
    methods: {
        contextMenuHandler(event) {
            var items = checkAuthInArr([
                {
                    label: '编辑',
                    onClick: () => {
                        this.dialogTitle = '编辑任务';
                        this.dialogComponent = 'form-page';
                        this.editHandler(this.data);
                    },
                    auth: 'task-edit',
                },
                {
                    label: '上报工时',
                    onClick: () => {
                        const procode = this.data.procode._id || this.$route.params.procode;

                        if (!procode) {
                            showMsg('上报工时缺失procode');
                            return;
                        }

                        this.dialogTitle = '上报工时';
                        this.dialogComponent = 'form-page-task-report';
                        this.form = {
                            procode,
                            taskcode: this.data._id,
                        };
                        this.dialogShow();
                    },
                },
                {
                    label: '修改状态',
                    children: Object.keys(CONFIG_STATE).reduce((arr, key) => {
                        var item = CONFIG_STATE[key];

                        if (item.show === false) {
                            return arr;
                        }

                        arr.push({
                            label: item.text,
                            icon: item.icon,
                            onClick: () => {
                                this.shiftState(key);
                            },
                        });

                        return arr;
                    }, []),
                },
                {
                    label: '归档',
                    onClick: () => {
                        showConfirm('归档后，该任务在项目中不可操作', '', () => {
                            this.fileHandler();
                        });
                    },
                    auth: 'task-file',
                    divided: true,
                },
                {
                    label: '删除',
                    onClick: () => {
                        showConfirm('确认以删除', '', () => {
                            this.delHandler();
                        });
                    },
                    auth: 'task-del',
                },
            ]);

            this.$contextmenu({
                items,
                x: event.clientX,
                y: event.clientY,
            });

            return false;
        },
        delHandler() {
            this.$post('/task/del', this.data, () => {
                showMsg('删除任务成功');

                this.reloadHandler();
            });
        },
        shiftState(state) {
            this.data.state = state;

            this.$post('/task/updatestete', this.data, () => {
                showMsg('任务状态更新成功');

                this.reloadHandler();
            });
        },
        reloadHandler() {
            this.$emit('reload');
        },
        // 归档
        fileHandler() {
            this.$post('/task/file', [this.data], () => {
                showMsg('任务状态更新成功');

                this.reloadHandler();
            }, true);
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
                margin-right: 10px;
            }
        }

        .title{
            display: flex;

            .icon{
                margin-right: 6px;
            }

            .text{
                display: flex;
                align-items: center;
                flex: 1;
                white-space: break-spaces;
            }

            .dropdown{
                display: flex;
                margin-left: 6px;
            }
        }
    }
</style>