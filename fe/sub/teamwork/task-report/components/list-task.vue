<template>
    <my-table
    :data="tableData"
    >
        <el-table-column label="成员" width="120px">
            <template slot-scope="scope">
                {{scope.row.member.name}}
            </template>
        </el-table-column>

        <el-table-column label="任务">
            <template slot-scope="scope">
                {{scope.row.taskcode.title}}
            </template>
        </el-table-column>

        <el-table-column label="工作日" prop="reporttime" width="120px"></el-table-column>
        <el-table-column label="工时" prop="tasktime" width="80px"></el-table-column>

        <el-table-column label="详情" prop="detail">
            <template slot-scope="scope">
                {{scope.row.detail || '-'}}
            </template>
        </el-table-column>
    </my-table>
</template>

<script>
export default {
    props: {
        data: {
            type: Object,
            default: () => ({
                taskcode: '',
            }),
        },
    },
    data() {
        return {
            tableData: [],
        };
    },
    methods: {
        queryData() {
            var taskcode = this.data._id;

            if (!taskcode) {
                return;
            }

            this.$get('/taskreport/list', {
                taskcode,
            }, data => {
                this.tableData = data;
            });
        },
    },
    created() {
        this.queryData();
    },
};
</script>