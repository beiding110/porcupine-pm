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
        title="任务项目"
        width="700px"
        >
            <form-page
                v-if="dialogVisible"
                :data="form"
                @cancle="dialogClose"
            ></form-page>
        </my-dialog>
    </card>
</template>

<script>
import DIALOG_LIST_MIXIN from '@mixins/dialog-list-page';

import CONFIG_STATE from '../config/state';

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
                        this.editHandler(this.data);
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
                            this.editHandler(this.data);
                        },
                    },
                    {
                        label: '修改状态',
                        children: Object.keys(CONFIG_STATE).reduce((arr, key) => {
                            var item = CONFIG_STATE[key];

                            arr.push({
                                label: item.text,
                                icon: item.icon,
                                onClick: () => {
                                    this.shiftState(item);
                                },
                            });

                            return arr;
                        }, []),
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
            this.$post('/task/del', this.data, () => {
                showMsg('删除任务成功');

                this.reloadHandler();
            });
        },
        shiftState(state) {
            // TODO: 设置状态为
            alert(state);
        },
        reloadHandler() {
            this.$emit('reload');
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