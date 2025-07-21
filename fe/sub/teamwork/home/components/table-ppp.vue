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
                    <el-tooltip content="切换表格内容" placement="top-end">
                        <el-button 
                        type="warning"
                        icon="el-icon-refresh"
                        @click="shiftHandler"
                        >
                            {{showKey.label}}
                        </el-button>
                    </el-tooltip>
                </el-form-item>
            </el-form>
        </div>

        <div class="body">
            <table class="table" cellspacing="0">

                <tr
                class="row"
                >
                    <td class="cell info">人员</td>
                    <td class="cell info">耗时（h）</td>

                    <td 
                    class="cell info"
                    v-for="pro in cols"
                    :key="pro.id"
                    >
                        {{pro.proname}}
                    </td>
                </tr>

                <template
                v-for="user in rows"
                >
                    <tr 
                    class="row"
                    :key="user.id"
                    >
                        <td 
                        class="cell info"
                        >
                            {{user.name}}
                        </td>

                        <td 
                        class="cell info"
                        >
                            {{user.sum}}
                        </td>

                        <td 
                        class="cell info"
                        v-for="pro in user.project"
                        :key="`${user.id}-${pro.id}`"
                        :class="cellClass(pro.normalize)"
                        >
                            {{pro[showKey.key]}}
                        </td>
                    </tr>
                </template>
            </table>
        </div>
    </el-card>
</template>

<script>
import pickerOptions from '@js/pickerOptions';

export default {
    mixins: [],
    components: {
        
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
            dateRange: [firstOfYear, lastDayOfYear],
            member: '',

            pickerOptions,

            cols: [],
            rows: [],

            showType: 0,
        };
    },
    computed: {
        showKey() {
            var key = [{
                key: 'percent',
                label: '百分比',
            }, {
                key: 'normalize',
                label: '小数',
            }, {
                key: 'sum',
                label: '合计',
            }];

            return key[this.showType];
        },
    },
    methods: {
        queryData() {
            this.$get('/taskreport/pppercent', {
                starttime: this.dateRange[0],
                endtime: this.dateRange[1],
                member: this.member,
            }, data => {
                this.cols = data.col;
                this.rows = data.row;
            });
        },
        shiftHandler() {
            this.showType++;

            if (this.showType > 2) {
                this.showType = 0;
            }
        },
        cellClass(num) {
            if (num === 0) {
                return ''
            } else if (num <= 0.2) {
                return 'normal';
            } else if (num <= 0.5) {
                return 'middle';
            } else {
                return 'high';
            }
        },
    },
    mounted() {
        this.queryData();
    },
}
</script>

<style lang="scss" scoped>
    .table{
        table-layout: fixed;

        .info{
            padding: 0 1em;
        }

        .year, .month, .day{

        } 

        .hot{
            .cell{
                border: none;
            }
        }

        .row{
            white-space: nowrap;
        }
        
        .cell{
            $cellSize: 20px;

            height: $cellSize;
            min-width: $cellSize;
            border: 1px solid #DCDFE6;
            text-align: center;
            cursor: default;
            background: white;
            box-sizing: border-box;

            &.high{
                border-color: #216E39;
                background-color: #216E39;
                color: white;
            }

            &.middle{
                border-color: #30A14E;
                background-color: #30A14E;
                color: white;
            }

            &.normal{
                border-color: #40C463;
                background-color: #40C463;
                color: white;
            }
        }
    }
</style>