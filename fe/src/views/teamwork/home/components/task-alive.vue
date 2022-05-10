<template>
    <div class="task-alive">
        <el-card 
        v-for="(table, tableIndex) in tableData" 
        :key="`table-${tableIndex}`"
        class="table-item"
        >
            <my-table
            :data="table.task"
            height="182px"
            >
                <el-table-column label="项目">
                    <template slot-scope="scope">
                        {{scope.row.procode.proname}}
                    </template>
                </el-table-column>

                <el-table-column label="任务" prop="title"></el-table-column>

                <el-table-column label="成员">
                    <template slot-scope="scope">
                        {{scope.row.members}}
                    </template>
                </el-table-column>

                <el-table-column label="状态" width="100px">
                    <template slot-scope="scope">
                        <state-tag :data="scope.row.state"></state-tag>
                    </template>
                </el-table-column>

                <el-table-column label="操作" width="140px">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="editHandler(scope.row)">进度</el-button>

                        <el-button type="text" icon="el-icon-s-flag" @click="gotoPro(scope.row)">项目</el-button>
                    </template>
                </el-table-column>
            </my-table>
        </el-card>

        <my-dialog v-model="dialogVisible" width="700px">
            <form-report 
                v-if="dialogVisible"
                :data="form"
                @cancle="dialogClose"
            ></form-report>
        </my-dialog>
    </div>
</template>

<script>
import DIALOG_LIST_MIXIN from '@mixins/dialog-list-page';

import StateTag from '../../task/components/state';
import FormReport from '../../task-report/form';

export default {
    mixins: [DIALOG_LIST_MIXIN],
    components: {
        FormReport,
        StateTag,
    },
    data() {
        return {
            tableData: [
                {state: '0', task: [],},
                {state: '1', task: [],},
                {state: '2', task: [],},
            ],
        }
    },
    methods: {
        queryData() {
            this.$get('/task/list-state', data => {
                var tableData = data;
                
                tableData = tableData.filter(item => {
                    return ~['0', '1', '2'].indexOf(item.state);
                });

                tableData.forEach(table => {
                    table.task.forEach(row => {
                        row.members = row.member.map(item => item.name).join(',');
                    });
                });

                this.tableData = tableData;
            });
        },
        editHandler(row) {
            this.form = {
                procode: row.procode._id,
                taskcode: row._id,
            };

            this.dialogShow();
        },
        gotoPro(row) {
            this.goto(`/teamwork/${row.procode._id}/task/index`)
        },
    },
    mounted() {
        this.queryData();
    },
};
</script>

<style lang="scss" scoped>
    .task-alive{
        height: 100%;
        overflow-x: auto;
        white-space: nowrap;

        .table-item{
            & + .table-item{
                margin-top: 10px;
            }
        }
    }
</style>