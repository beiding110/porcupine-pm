<template>
    <div class="time-line">
        <el-card>
            <time-line
                :data="tableData"
                :groups="groupsData"
                @contextmenu="contextMenuHandler"
            ></time-line>

            <my-dialog 
            v-model="dialogVisible" 
            :title="dialogTitle"
            width="700px"
            >
                <component
                    v-if="dialogVisible"
                    :is="dialogComponent"
                    :data="form"
                    @cancel="dialogClose"
                ></component>
            </my-dialog>
        </el-card>
    </div>
</template>

<script>
import DIALOG_LIST_MIXIN from '@mixins/dialog-list-page';
import { checkAuthInArr } from '@js/authority';

import TimeLine from '@components/time-line';

import CONFIG from './config/state';

import FormPage from './form';
import FormPageTaskReport from '../task-report/form';

export default {
    mixins: [DIALOG_LIST_MIXIN],
    components: {
        TimeLine,
        FormPage,
        FormPageTaskReport,
    },
    data() {
        return {
            tableData: [],
            groupsData: [],

            dialogTitle: '',
            dialogComponent: '',
        };
    },
    methods: {
        queryData() {
            this.$get(
                '/task/timeline',
                {
                    procode: this.$route.params.procode,
                },
                (data) => {
                    var tableData = data.data,
                        groupsData = data.group;

                    tableData = tableData.map((item) => {
                        let memberHTML = '';

                        item.member.forEach((row) => {
                            memberHTML += `<div class="item">${row.name.slice(0, 1)}</div>`;
                        });

                        return {
                            id: item._id,
                            group: item.groupcode,
                            content: item.title,
                            start: item.starttime,
                            end: `${item.endtime} 23:59:59`,
                            state: item.state,
                            className: CONFIG[item.state].type,
                            visibleFrameTemplate: `
                            <div class="sub">
                                <div class="members">
                                    ${memberHTML}
                                </div>
                            </div>
                        `,
                        };
                    });

                    groupsData = groupsData.map((item) => {
                        return {
                            id: item._id,
                            content: item.title,
                        };
                    });

                    this.tableData = tableData;

                    this.groupsData = groupsData;
                }
            );
        },

        contextMenuHandler(e) {
            const { item: id, event } = e;

            var items = checkAuthInArr([
                {
                    label: '编辑',
                    onClick: () => {
                        this.dialogTitle = '编辑任务';
                        this.dialogComponent = 'form-page';
                        this.editHandler({
                            _id: id,
                        });
                    },
                    auth: 'task-edit',
                },
                {
                    label: '上报工时',
                    onClick: () => {
                        const procode = this.$route.params.procode;

                        this.dialogTitle = '上报工时';
                        this.dialogComponent = 'form-page-task-report';
                        this.form = {
                            procode,
                            taskcode: id,
                        };
                        this.dialogShow();
                    },
                },
                {
                    label: '修改状态',
                    children: Object.keys(CONFIG).reduce((arr, key) => {
                        var item = CONFIG[key];

                        if (item.show === false) {
                            return arr;
                        }

                        arr.push({
                            label: item.text,
                            icon: item.icon,
                            onClick: () => {
                                this.shiftState(id, key);
                            },
                        });

                        return arr;
                    }, []),
                },
            ]);

            this.$contextmenu({
                items,
                x: event.clientX,
                y: event.clientY,
            });

            return false;
        },

        shiftState(id, state) {
            this.$post(
                '/task/updatestete',
                {
                    _id: id,
                    state: state,
                },
                () => {
                    showMsg('任务状态更新成功');

                    this.queryData();
                }
            );
        },
    },
    mounted() {
        this.queryData();
    },
};
</script>

<style lang="scss">
.sub {
    .members {
        display: flex;
        padding: 2px 5px;
        overflow: hidden;

        .item {
            font-size: 12px;
            background: #c0c4cc;
            line-height: 1em;
            padding: 2px;
            border-radius: 8px;
            color: white;

            & + .item {
                margin-left: 2px;
            }
        }
    }
}
</style>
