<template>
    <div class="tui-calendar">
        <div class="menu">
            <el-form class="menu-navi" inline size="small">
                <el-form-item>
                    <el-button size="small" @click="shiftTo('prev')" icon="el-icon-arrow-left"></el-button>
                    <el-button size="small" @click="backToToday">今日</el-button>
                    <el-button size="small" @click="shiftTo('next')" icon="el-icon-arrow-right"></el-button>
                </el-form-item>
                
                <el-form-item>
                    <el-date-picker
                        v-model="date"
                        type="month"
                        placeholder="选择月"
                        size="small"
                        format="yyyy-MM"
                        value-format="yyyy-MM"
                        @change="dateSel"
                    ></el-date-picker>
                </el-form-item>
            </el-form>
        </div>

        <div id="calendar" ref="calendar"></div>
    </div>
</template>

<script>
import Calendar from 'tui-calendar'; /* ES6 */
import 'tui-calendar/dist/tui-calendar.css';

export default {
    props: {
        schedule: {
            type: Array,
            default: () => [],
        },
        props: {
            type: Object,
            default: () => ({}),
        },
    },
    data() {
        return {
            calendar: null,

            date: new Date().pattern('yyyy-MM'),
        };
    },
    watch: {
        schedule: {
            handler(n) {
                var scheduleRebuild = this.rebuildSchedule(n);

                try{
                    this.calendar.clear();

                    this.calendar.createSchedules(scheduleRebuild);
                } catch(e) {
                    // e
                }
            },
            deep: true,
            immediate: true,
        }
    },
    methods: {
        backToToday() {
            this.calendar.today();

            this.date = new Date().pattern('yyyy-MM');
        },
        shiftTo(type) {
            this.calendar[type]();
            
            var _date = this.calendar.getDate()._date;

            this.date = new Date(_date).pattern('yyyy-MM');

            this.$emit('change', this.date);
        },
        dateSel(e) {
            this.calendar.setDate(new Date(e));
        },
        rebuildSchedule(arr) {
            function propFactory(key, item) {
                var keyInProps = this.props[key];

                if (typeof keyInProps === 'function') {
                    return keyInProps(item);
                }

                return item[keyInProps];
            }

            return arr.map(item => ({
                id: propFactory.call(this, 'id', item),
                title: propFactory.call(this, 'title', item),
                start: propFactory.call(this, 'start', item),
                end: propFactory.call(this, 'end', item),
                bgColor: propFactory.call(this, 'bgColor', item),
                category: 'allday',
                isAllDay: true,
                color: '#fff',
            }));
        }
    },
    mounted() {
        this.calendar = new Calendar('#calendar', {
            defaultView: 'month',
            taskView: true,
            isReadOnly: true,
            month: {
                daynames: ['日', '一', '二', '三', '四', '五', '六'],
                startDayOfWeek: 0,
                narrowWeekend: true
            },
            week: {
                daynames: ['日', '一', '二', '三', '四', '五', '六'],
                startDayOfWeek: 0,
                narrowWeekend: true
            }
        });
    },
    beforeDestroy() {
        this.calendar.destroy();
    },
}
</script>

<style lang="scss" scoped>
    .tui-calendar{
        .menu{
            .menu-navi{
                
            }
        }
    }
</style>