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
                    :key="`info-row-${proItem.id}-${memberItem.id}`"
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

            <div class="empty" v-if="!data.length">空</div>
        </div>

        <div 
        ref="wheelBody"
        class="body" 
        @wheel.prevent="scrollBodyWheelHandler"
        >
            <div class="scroll-wrap">
                <table-canvas
                    :date="dayRange"
                    :data="data"
                ></table-canvas>
            </div>

            <div class="empty" v-if="!data.length">空</div>
        </div>
    </div>
</template>

<script>
import TableCanvas from './components/table-canvas';

export default {
    components: {TableCanvas,},
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

            this.setColNum(arr);

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
                mcolindex,
                ycolindex;

            var d = nDate.getDate(),
                m = nDate.getMonth() + 1;

            if (d === 1 || delta === 0) {
                mcolindex = 0;
            }

            if (delta === 0 || (m === 1 && d === 1)) {
                ycolindex = 0;
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
                mcolnum: 0,
                ycolindex,
                ycolnum: 0,
            }
        },
        setColNum(arr) {
            var lastYear = '',
                yearDayNum = 0,
                lastMonth = '',
                monthDayNum = 0;

            arr.reverse();

            arr.forEach(item => {
                if (item.y !== lastYear) {
                    lastYear = item.y;
                    yearDayNum = 1;
                } else {
                    yearDayNum ++;
                }

                item.ycolnum = yearDayNum;

                if (item.m !== lastMonth) {
                    lastMonth = item.m;
                    monthDayNum = 1;
                } else {
                    monthDayNum ++;
                }

                item.mcolnum = monthDayNum;
            });

            arr.reverse();
        },
        // 横向滚动
        scrollBodyWheelHandler(e) {
            this.$refs.wheelBody.scrollLeft += e.deltaY;
        },
    },
    mounted() {
        
    }
}
</script>

<style lang="scss" scoped>
    @import '@css/var.scss';

    $borderStyle: 1px solid #DCDFE6;

    .hotspot-map{
        position: relative;
        display: flex;
        border: $borderStyle;
        min-height: 120px;

        .empty{
            position: absolute;
            left: 50%;
            top: calc(50% + 30px);
            transform: translate(-50%, -50%);
            color: $infoColor;
            cursor: default;
        }

        .head, .body{
            position: relative;
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
                border-right: $borderStyle;
                border-bottom: $borderStyle;
                text-align: center;
                cursor: default;
                background: white;
                box-sizing: border-box;
            }
        }
    }
</style>