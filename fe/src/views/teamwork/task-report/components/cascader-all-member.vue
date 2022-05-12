<template>
    <tui-calendar
        :schedule="tableData"
        :props="dataProps"
        @change="queryData"
    ></tui-calendar>
</template>

<script>
import TuiCalendar from '@components-sys/tui-calendar';

export default {
    components: {
        TuiCalendar,
    },
    data() {
        return {
            tableData: [],
            dataProps: {
                id: '_id', 
                title: (item) => `${item.member.name}:${item.procode.proname}`, 
                start: 'reporttime', 
                end: 'reporttime', 
                bgColor: item => `#${item.member._id.slice(-7, -1)}`,
            },
        };
    },
    methods: {
        queryData(date) {
            this.$get('/taskreport/all', {
                time: date,
            }, data => {
                this.tableData = data;
            });
        },
    },
    mounted() {
        var date = new Date().pattern('yyyy-MM');

        this.queryData(date);
    },
}
</script>