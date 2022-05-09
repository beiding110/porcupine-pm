<template>
    <div class="hotspot-map">
        <div class="head">
            <table class="table" cellspacing="0">
                <tr
                class="row"
                >
                    <td class="cell" colspan="2" rowspan="2"></td>
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
                    <td class="cell"></td>
                    <td class="cell"></td>
                    <td class="cell"></td>
                </tr>

                <template
                v-for="proItem in data"
                >
                    <tr 
                    class="row"
                    v-for="(memberItem, memberIndex) in proItem.member"
                    :key="memberIndex"
                    >
                        <td 
                        v-if="memberIndex === 0"
                        class="proname cell info" 
                        :rowspan="proItem.member.length"
                        >
                            {{proItem.proname}}
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
                                :key="index" 
                                :name="item.date"
                            />
                        </template>
                    </colgroup>
                    <tbody>
                        <tr class="row year">
                            <template v-for="(item, index) in dayRange">
                                <td 
                                v-if="item.ycolindex === 0"
                                :key="index" 
                                class="date cell"
                                :class="item.date"
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
                                :key="index" 
                                class="date cell" 
                                :class="item.date"
                                :colspan="item.mcolnum"
                                >
                                    {{item.m}}
                                </td>
                            </template>
                        </tr>
                        <tr class="row day">
                            <template v-for="(item, index) in dayRange">
                                <td 
                                :key="index" 
                                class="date cell"
                                :class="item.date"
                                >
                                    {{item.d}}
                                </td>
                            </template>
                        </tr>

                        <template
                        v-for="proItem in data"
                        >
                            <tr 
                            class="row hot"
                            v-for="(memberItem, memberIndex) in proItem.member"
                            :key="memberIndex"
                            >
                                <template v-for="(item, index) in dayRange">
                                    <td 
                                    :key="index" 
                                    class="cell"
                                    :class="item.date"
                                    :style="calcHotPoint(memberItem, item)"
                                    >
                                        
                                    </td>
                                </template>
                            </tr>
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
                {
                    proname: '项目1',
                    member: [
                        {
                            name: '人员1',
                            tasktime: 8,
                            report: [
                                {
                                    reporttime: '2022-05-09',
                                    tasktime: 8,
                                    reporttimes: 1,
                                }
                            ]
                        },
                        {
                            name: '人员2',
                            tasktime: 8,
                            report: [
                                {
                                    reporttime: '2022-05-09',
                                    tasktime: 8,
                                    reporttimes: 1,
                                }
                            ]
                        }
                    ]
                }
            ],
        },
    },
    data() {
        return {
            dayRange: [],
        };
    },
    methods: {
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

            return {
                y: nDate.getFullYear(),
                m,
                d,
                date: nDate.pattern('yyyy-MM-dd'),
                mcolindex,
                mcolnum,
                ycolindex,
                ycolnum,
            }
        },

        calcHotPoint(memberItem, dateItem) {
            var date = dateItem.date,
                report = memberItem.report;
            
            console.log(date, report)

            if (!report.some(item => {
                return item.reporttime === date;
            })) {
                return {};
            }

            return {
                background: 'red',
                borderColor: 'red',
            };
        }
    },
    mounted() {
        var start = '2022-5-2',
            end = '2022-5-22';

        var length = this.calcDatRange(start, end);

        var arr = [];

        for (var i = 0; i < length; i ++) {
            arr.push(this.calcDateInfo(start, i));
        }

        this.dayRange = arr;
    }
}
</script>

<style lang="scss" scoped>
    @import '@css/var.scss';

    .hotspot-map{
        position: relative;
        display: flex;

        .head{

        }

        .body{
            overflow: auto;

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
                    background: #EBEDF0;
                }
            }
        }
    }
</style>