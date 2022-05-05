<template>
    <el-card>
        <my-search 
        v-model="pgData" 
        @search="queryData"
        time-start-placeholder="工作日早至"
        time-end-placeholder="工作日晚至"
        >
            <el-form-item>
                <my-select 
                    placeholder="成员"
                    v-model="pgData.member" 
                    :props="{label:'name', value:'_id'}"
                    :url="`/projectmember/list?procode=${$route.params.procode}`"
                ></my-select>
            </el-form-item>

            <span slot="title"></span>
        </my-search>

        <my-table
        :data="tableData"
        >
            <el-table-column label="成员">
                <template slot-scope="scope">
                    {{scope.row.member.name}}
                </template>
            </el-table-column>

            <el-table-column label="任务">
                <template slot-scope="scope">
                    {{scope.row.taskcode.title}}
                </template>
            </el-table-column>

            <el-table-column label="工作日" prop="reporttime"></el-table-column>
            <el-table-column label="工时" prop="tasktime"></el-table-column>

            <el-table-column label="操作" width="100px">
                <template slot-scope="scope">
                    <el-button type="text" icon="el-icon-edit" @click="editHandler(scope.row)">编辑</el-button>
                </template>
            </el-table-column>
        </my-table>

        <my-dialog
        v-model="dialogVisible"
        title="调整工作量"
        width="700px"
        >
            <form-page 
                v-if="dialogVisible"
                :data="form"
                @cancle="dialogClose"
            ></form-page>
        </my-dialog>
    </el-card>
</template>

<script>
import LIST_MIXIN from '@mixins/list-page';
import DIALOG_LIST_MIXIN from '@mixins/dialog-list-page';

import FormPage from './form';

export default {
    mixins: [LIST_MIXIN, DIALOG_LIST_MIXIN],
    components: {
        FormPage,
    },
    data() {
        return {
            pgData: {
                member: '',
            },
        }
    },
    methods: {
        queryData() {
            this.$get('/taskreport/list', {
                ...this.pgData,
                procode: this.$route.params.procode,
            }, data => {
                this.tableData = data;
            });
        },
        reloadHandler() {
            this.queryData();
        },
    },
    created() {
        this.queryData();
    },
};
</script>