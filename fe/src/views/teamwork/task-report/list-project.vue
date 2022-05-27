<template>
    <div>
        <el-row :gutter="10" class="row">
            <el-col :span="24">
                <el-card>
                    <hotspot-map
                        :data="hmData"
                        :range="hmRange"
                    ></hotspot-map>
                </el-card>
            </el-col>
        </el-row>

        <el-row :gutter="10" class="row">
            <el-col :span="12">
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
                    height="608px"
                    >
                        <el-table-column label="成员" width="80px">
                            <template slot-scope="scope">
                                {{scope.row.member.name}}
                            </template>
                        </el-table-column>

                        <el-table-column label="任务">
                            <template slot-scope="scope">
                                {{scope.row.taskcode.title}}
                            </template>
                        </el-table-column>

                        <el-table-column label="工作日" prop="reporttime" width="100px"></el-table-column>
                        <el-table-column label="工时" prop="tasktime" width="60px"></el-table-column>

                        <el-table-column label="内容">
                            <template slot-scope="scope">
                                {{scope.row.detail || '-'}}
                            </template>
                        </el-table-column>

                        <el-table-column label="操作" width="80px">
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
            </el-col>
            <el-col :span="12">
                <el-card>
                    <tui-calendar
                        :schedule="tableData"
                        :props="{id: '_id', title: (item) => `${item.member.name}:${item.taskcode.title}`, start: 'reporttime', end: 'reporttime', bgColor: item => `#${item.member._id.slice(-7, -1)}`}"
                    ></tui-calendar>
                </el-card>
            </el-col>
        </el-row>

        <el-row :gutter="10" class="row">
            <el-col :span="12">
                <el-card>
                    <echarts :data="ecData_byTime"></echarts>
                </el-card>
            </el-col>

            <el-col :span="12">
                <el-card>
                    <echarts :data="ecData_byMember"></echarts>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import LIST_MIXIN from '@mixins/list-page';
import DIALOG_LIST_MIXIN from '@mixins/dialog-list-page';

import TuiCalendar from '@components-sys/tui-calendar';
import HotspotMap from '@components-sys/hotspot-map/index';

import FormPage from './form';
import Echarts from '../../../components/echarts';

import chartByTime from './utils/chartByTime';
import chartByMember from './utils/chartByMember';

export default {
    mixins: [LIST_MIXIN, DIALOG_LIST_MIXIN],
    components: {
        FormPage,
        TuiCalendar,
        HotspotMap,
        Echarts,
    },
    data() {
        var today = new Date().getTime();

        var endtime = new Date(today + (1 * 24 * 60 * 60 * 1000)),
            starttime = new Date(today - (30 * 24 * 60 * 60 * 1000));

        starttime = starttime.pattern('yyyy-MM-dd');
        endtime = endtime.pattern('yyyy-MM-dd');

        return {
            pgData: {
                member: '',
                starttime,
                endtime,
            },

            ecData_byTime: {},
            ecData_byMember: {},

            hmData: [],
            hmRange: [],
        }
    },
    methods: {
        queryData() {
            this.$get('/taskreport/list', {
                ...this.pgData,
                procode: this.$route.params.procode,
            }, data => {
                this.tableData = data;

                this.ecData_byTime = chartByTime(data);
                this.ecData_byMember = chartByMember(data);
            });
        },
        reloadHandler() {
            this.queryData();
        },
        queryHmData() {
            this.$get('/taskreport/hotmapbyproject', {
                procode: this.$route.params.procode,
            }, data => {
                this.hmData = data.data;
                this.hmRange = data.range;
            });
        },
    },
    created() {
        this.queryData();

        this.queryHmData();
    },
};
</script>

<style lang="scss" scoped>
    .row{
        & + .row{
            margin-top: 10px;
        }
    }
</style>