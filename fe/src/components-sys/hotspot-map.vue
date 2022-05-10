<template>
    <div class="hotspot-map">
        <div class="head">
            <table class="table" cellspacing="0">
                <tr
                class="row"
                >
                    <td class="cell" colspan="3" rowspan="2"></td>
                    <td class="cell"></td>
                </tr>
                
                <tr
                class="row"
                >
                    <td class="cell"></td>
                </tr>

                <tr
                class="row"
                >
                    <td class="cell info">项目名称</td>
                    <td class="cell info">项目耗时（h·人）</td>
                    <td class="cell info">人员耗时（h）</td>
                    <td class="cell info">人员</td>
                </tr>

                <template
                v-for="proItem in data"
                >
                    <tr 
                    class="row"
                    v-for="(memberItem, memberIndex) in proItem.member"
                    :key="`${memberItem.id}-${memberIndex}`"
                    >
                        <td 
                        v-if="memberIndex === 0"
                        class="proname cell info" 
                        :rowspan="proItem.member.length"
                        >
                            {{proItem.proname}}
                        </td>

                        <td 
                        v-if="memberIndex === 0"
                        class="tasktime cell"
                        :rowspan="proItem.member.length"
                        >
                            {{proItem.tasktime}}
                        </td>

                        <td 
                        class="tasktime cell"
                        >
                            {{memberItem.tasktime}}
                        </td>
                        <td class="member cell info">
                            {{memberItem.name}}
                        </td>
                    </tr>
                </template>
            </table>
        </div>

        <div class="body">
            <div class="scroll-wrap">
                <table class="scroll-wrap table" cellspacing="0">
                    <colgroup> 
                        <template v-for="(item, index) in dayRange">
                            <col 
                                width="20"
                                :key="item.date" 
                                :name="item.date"
                            />
                        </template>
                    </colgroup>
                    <tbody>
                        <tr class="row year">
                            <template v-for="(item, index) in dayRange">
                                <td 
                                v-if="item.ycolindex === 0"
                                :key="item.date" 
                                class="year cell"
                                :class="item.y"
                                :colspan="item.ycolnum"
                                >
                                    {{item.y}}
                                </td>
                            </template>
                        </tr>
                        <tr class="row month">
                            <template v-for="(item, index) in dayRange">
                                <td 
                                v-if="item.mcolindex === 0"
                                :key="item.date" 
                                class="month cell" 
                                :class="item.m"
                                :colspan="item.mcolnum"
                                >
                                    {{item.m}}
                                </td>
                            </template>
                        </tr>

                        <tr class="row day">
                            <template v-for="(item, index) in dayRange">
                                <td 
                                :key="item.date" 
                                class="date cell"
                                :class="[item.date, ~[0,6].indexOf(item.day) ? 'weekend' : 'workday', item.today ? 'today' : '']"
                                >
                                    {{item.d}}
                                </td>
                            </template>
                        </tr>

                        <template
                        v-for="proItem in data"
                        >
                            <template
                            v-for="(memberItem, memberIndex) in proItem.member"
                            >
                                <tr 
                                class="row hot"
                                :key="`${proItem.id}-${memberIndex}`"
                                >
                                    <template v-for="(item, index) in dayRange">
                                        <td 
                                        :key="item.date" 
                                        class="cell"
                                        :class="[item.date, item.today ? 'today' : '']"
                                        :style="calcHotPoint(memberItem, item)"
                                        >
                                            
                                        </td>
                                    </template>
                                </tr>
                            </template>
                        </template>
                    </tbody>
                </table>
                
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        data: {
            type: Array,
            default: () => [
                // {
                //     proname: '项目1',
                //     member: [
                //         {
                //             name: '人员1',
                //             tasktime: 8,
                //             report: [
                //                 {
                //                     reporttime: '2022-05-09',
                //                     tasktime: 8,
                //                     reporttimes: 1,
                //                 }
                //             ]
                //         },
                //         {
                //             name: '人员2',
                //             tasktime: 8,
                //             report: [
                //                 {
                //                     reporttime: '2022-05-09',
                //                     tasktime: 8,
                //                     reporttimes: 1,
                //                 }
                //             ]
                //         }
                //     ]
                // }
            ],
        },
        range: {
            type: Array,
            default: () => [],
        },
    },
    data() {
        return {
            dayRange: [],

            today: new Date().pattern('yyyy-MM-dd'),
        };
    },
    watch: {
        range: {
            handler() {
                this.initDateRange();
            },
            immediate: true,
        },
    },
    methods: {
        initDateRange() {
            var start = this.range[0],
                end = this.range[1];

            var length = this.calcDatRange(start, end);

            var arr = [];

            for (var i = 0; i <= length; i ++) {
                arr.push(this.calcDateInfo(start, i));
            }

            this.dayRange = arr;
        },
        calcDatRange(startDate, endDate) {
            var start = new Date(startDate) - 0,
                end = new Date(endDate) - 0;

            return (end - start) / (24 * 60 * 60 * 1000)
        },
        getDayInMonth(date) {
            var day = new Date(date),
                month = day.getMonth();

            day.setMonth(month + 1);
            day.setDate(0);

            return day.getDate();
        },
        getDayInYear(date) {
            var yearDaySum = 0,
                day = new Date(date);

            for(var i = 0; i < 12; i ++) {
                day.setMonth(i);

                yearDaySum += this.getDayInMonth(day);
            }

            return yearDaySum;
        },
        getDayRemainYear(date) {
            var day = new Date(date),
                year = day.getFullYear();

            var nextYear = new Date(date);

            nextYear.setFullYear(year + 1);
            nextYear.setMonth(0);
            nextYear.setDate(1);

            return (nextYear - day) / (24 * 60 * 60 * 1000)
        },
        calcDateInfo(date, delta) {
            var day = new Date(date).getTime(),
                nDay = day + (delta * 24 * 60 * 60 * 1000);

            var nDate = new Date(nDay),
                mcolnum,
                mcolindex,
                ycolnum,
                ycolindex;

            var d = nDate.getDate(),
                m = nDate.getMonth() + 1;

            if (d === 1 || delta === 0) {
                mcolindex = 0;
                mcolnum = this.getDayInMonth(date) - d + 1;
            }

            if (delta === 0 || (m === 1 && d === 1)) {
                ycolindex = 0;

                if (delta === 0) {
                    ycolnum = this.getDayRemainYear(date);
                } else if (m === 1 && d === 1) {
                    ycolnum = this.getDayInYear(date);
                }
            }

            var date = nDate.pattern('yyyy-MM-dd'),
                today = (date === this.today);

            return {
                y: nDate.getFullYear(),
                m,
                d,
                date,
                day: nDate.getDay(),
                today,
                mcolindex,
                mcolnum,
                ycolindex,
                ycolnum,
            }
        },

        calcHotPoint(memberItem, dateItem) {
            var date = dateItem.date,
                report = memberItem.report,
                reportIndex;

            if (!report.some((item, index) => {
                if(item.reporttime === date) {
                    reportIndex = index;

                    return true;
                }

                return false;
            })) {
                return {};
            }

            var reporttime = report[reportIndex].reporttime,
                reporttimes = report[reportIndex].reporttimes;

            return {
                background: this.calcColor(reporttimes),
                borderColor: this.calcColor(reporttimes),
            };
        },
        calcColor(num) {
            var normalColor = '#40C463',
                middleColor = '#30A14E',
                highColor = '#216E39';

            if (num <= 1) {
                return normalColor;
            } else if (num <= 2) {
                return middleColor;
            } else {
                return highColor;
            }
        }
    },
    mounted() {
        
    }
}
</script>

<style lang="scss" scoped>
    @import '@css/var.scss';

    .hotspot-map{
        position: relative;
        display: flex;
        border: 1px solid #DCDFE6;

        .head{

        }

        .body{
            overflow: auto;
            flex: 1;

            .scroll-wrap{}
        }

        .table{
            table-layout: fixed;

            .info{
                padding: 0 1em;
            }

            .year, .month, .day{

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

                &.date{

                    &.weekend{
                        background: #EBEDF0;
                    }
                }

                &.today{
                    border-right-color: $dangerColor;

                    & + .cell{
                        border-left-color: $dangerColor;
                    }
                }
            }
        }
    }
</style>