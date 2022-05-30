<template>
    <el-card class="file-list">
        <el-form inline size="small">
            <el-form-item>
                <el-date-picker
                    v-model="pgData.time"
                    type="month"
                    placeholder="选择月"
                    format="yyyy-MM"
                    value-format="yyyy-MM"
                    @change="queryData"
                ></el-date-picker>
            </el-form-item>
        </el-form>

        <my-table
        :data="tableData"
        :height="tableHeight + 100"
        >
            <el-table-column label="日期" prop="reporttime" width="100" fixed></el-table-column>

            <el-table-column 
            v-for="col in cols"
            :key="col._id"
            :label="col.name" 
            :props="col._id"
            >
                <template slot-scope="scope">
                    <div 
                        v-for="(report, index) in scope.row[col._id]" 
                        :key="index"
                        v-html="contentBuilder(report)"
                    ></div>
                </template>
            </el-table-column>
        </my-table>
    </el-card>
</template>

<script>
import LIST_MIXIN from '@mixins/list-page';

export default {
    mixins: [LIST_MIXIN],
    components: {
        
    },
    data() {
        var time = new Date().pattern('yyyy-MM');

        return {
            pgData: {
                time,
            },

            cols: [],
        };
    },
    methods: {
        queryData() {
            this.$get('/taskreport/monthly', this.pgData, data => {

                this.tableData = data.rows;
                this.cols = data.cols;

            });
        },
        contentBuilder(row) {
            return `【${row.proname}】${row.detail || '-'}`
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