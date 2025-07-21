<template>
    <el-card class="hotspot-map">
        <div class="menu">
            <el-form class="menu-navi" inline size="small">                
                <el-form-item>
                    <el-date-picker
                        v-model="dateRange"
                        type="daterange"
                        size="small"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                        :picker-options="pickerOptions"
                        unlink-panels
                        @change="queryData"
                    ></el-date-picker>
                </el-form-item>

                <el-form-item>
                    <my-select 
                        placeholder="成员"
                        v-model="member" 
                        :props="{label:'name', value:'_id'}"
                        :url="`/projectmember/list`"
                        @select="queryData"
                    ></my-select>
                </el-form-item>

                <el-form-item>
                    <el-button 
                        type="warning"
                        icon="el-icon-help" 
                        @click="dialogShow"
                    ></el-button>
                </el-form-item>
            </el-form>
        </div>

        <hotspot-map
            :data="data"
            :range="dateRange"
        ></hotspot-map>

        <my-dialog v-model="dialogVisible">
            <echarts 
                v-if="dialogVisible"
                :data="ecData"
                height="500px"
            ></echarts>
        </my-dialog>
    </el-card>
</template>

<script>
import DIALOG_LIST_MIXIN from '@mixins/dialog-list-page';

import Echarts from '@components/echarts';

import HotspotMap from '@components-sys/hotspot-map/index';

import pickerOptions from '@js/pickerOptions';

export default {
    mixins: [DIALOG_LIST_MIXIN],
    components: {
        Echarts,
        HotspotMap,
    },
    data() {
        var firstOfYear = new Date(),
            lastDayOfYear = new Date();

        firstOfYear.setMonth(0);
        firstOfYear.setDate(1);

        lastDayOfYear.setMonth(11);
        lastDayOfYear.setDate(31);

        firstOfYear = firstOfYear.pattern('yyyy-MM-dd');
        lastDayOfYear = lastDayOfYear.pattern('yyyy-MM-dd');

        return {
            data: [],

            dateRange: [firstOfYear, lastDayOfYear],
            member: '',

            pickerOptions: pickerOptions,
        };
    },
    computed: {
        ecData() {
            return {
                title: {
                    text: '项目-工时/人力统计',
                    left: 'center',
                },
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b}: {c} ({d}%)',
                },
                legend: {
                    orient: 'vertical',
                    left: 'left'
                },
                series: [
                    {
                        name: '工时',
                        type: 'pie',
                        radius: '40%',
                        data: this.data.map(item => {
                            return {
                                value: item.tasktime,
                                name: item.proname,
                            }
                        }),
                    },
                    {
                        name: '人力',
                        type: 'pie',
                        radius: ['45%', '60%'],
                        data: this.data.map(item => {
                            return {
                                value: item.member.length,
                                name: item.proname,
                            }
                        }),
                    }
                ],
            };
        },
    },
    methods: {
        queryData() {
            this.$get('/taskreport/hotmap', {
                starttime: this.dateRange[0],
                endtime: this.dateRange[1],
                member: this.member,
            }, data => {
                this.data = data;
            });
        },
    },
    mounted() {
        this.queryData();
    },
}
</script>

<style lang="scss" scoped>
    
</style>