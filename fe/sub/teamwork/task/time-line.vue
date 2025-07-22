<template>
    <div class="time-line">
        <el-card>
            <time-line
                :data="tableData"
                :groups="groupsData"
            ></time-line>
        </el-card>
    </div>
</template>

<script>
import TimeLine from '@components/time-line';

import CONFIG from './config/state';

export default {
    components: {
        TimeLine,
    },
    data() {
        return {
            tableData: [],
            groupsData: [],
        };
    },
    methods: {
        queryData() {
            this.$get('/task/timeline', {
                procode: this.$route.params.procode,
            }, data => {
                var tableData = data.data,
                    groupsData = data.group;

                tableData = tableData.map(item => {
                    return {
                        id: item._id,
                        group: item.groupcode,
                        content: item.title,
                        start: item.starttime,
                        end: `${item.endtime} 23:59:59`,
                        state: item.state,
                        className: CONFIG[item.state].type,
                    };
                });

                groupsData = groupsData.map(item => {
                    return {
                        id: item._id,
                        content: item.title,
                    };
                });

                this.tableData = tableData;

                this.groupsData = groupsData;
            });
        },
    },
    mounted() {
        this.queryData();
    },
};
</script>