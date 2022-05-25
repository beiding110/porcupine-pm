<template>
    <el-card class="file-list">
        <my-search 
            v-model="pgData" 
            @search="queryData"
            title-placeholder="任务名称"
            time-start-placeholder="归档时间早至"
            time-end-placeholder="归档时间早至"
        ></my-search>

        <my-table
        :data="tableData"
        :height="tableHeight + 100"
        >
            <el-table-column label="归档时间" prop="filetime" width="160"></el-table-column>

            <el-table-column label="项目" width="180">
                <template slot-scope="scope">
                    {{scope.row.procode.proname}}
                </template>
            </el-table-column>

            <el-table-column label="任务" prop="title" min-width="180"></el-table-column>

            <el-table-column label="计划开始" prop="starttime" width="120">
                <template slot-scope="scope">
                    {{scope.row.starttime || '-'}}
                </template>
            </el-table-column>
            <el-table-column label="计划结束" prop="endtime" width="120">
                <template slot-scope="scope">
                    {{scope.row.endtime || '-'}}
                </template>
            </el-table-column>
            <el-table-column label="计划持续" prop="duration" width="80">
                <template slot-scope="scope">
                    {{scope.row.duration || '-'}}
                </template>
            </el-table-column>
            <el-table-column label="优先级" prop="level" width="80">
                <template slot-scope="scope">
                    <level-state 
                        v-if="scope.row.level"
                        :data="scope.row.level"
                    ></level-state>
                    <template v-else>
                        -
                    </template>
                </template>
            </el-table-column>

            <el-table-column label="成员">
                <template slot-scope="scope">
                    {{scope.row.members}}
                </template>
            </el-table-column>

            <el-table-column label="操作" prop="level" width="120">
                <template slot-scope="scope">
                    <el-button 
                    type="text" 
                    icon="el-icon-date"
                    @click="editHandler(scope.row)"
                    >
                        工时记录
                    </el-button>
                </template>
            </el-table-column>
        </my-table>

        <my-dialog 
        v-model="dialogVisible"
        :title="`${form.title}-工时记录`"
        >
            <list-task 
                v-if="dialogVisible"
                :data="form"
            ></list-task>
        </my-dialog>
    </el-card>
</template>

<script>
import LIST_MIXIN from '@mixins/list-page';
import DIALOG_LIST_MIXIN from '@mixins/dialog-list-page';

import LevelState from './components/level';
import ListTask from '../task-report/components/list-task';

export default {
    mixins: [LIST_MIXIN, DIALOG_LIST_MIXIN],
    components: {
        LevelState,
        ListTask,
    },
    data() {
        var today = new Date().getTime();

        var endtime = new Date(today + (1 * 24 * 60 * 60 * 1000)),
            starttime = new Date(today - (30 * 24 * 60 * 60 * 1000));

        starttime = starttime.pattern('yyyy-MM-dd');
        endtime = endtime.pattern('yyyy-MM-dd');

        return {
            pgData: {
                starttime,
                endtime,
            },
        };
    },
    methods: {
        queryData() {
            this.$get('/task/list-file', this.pgData, data => {
                var tableData = data;

                tableData.forEach(row => {
                    row.members = row.member.map(item => item.name).join(',');
                });

                this.tableData = tableData;
            });
        },
    },
    mounted() {
        this.queryData();
    },
};
</script>

<style lang="scss" scoped>
    .file-list{
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
    }
</style>