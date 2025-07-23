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
                    let memberHTML = '';

                    item.member.forEach(row => {
                        memberHTML += `<div class="item">${ row.name.slice(0, 1) }</div>`;
                    });

                    return {
                        id: item._id,
                        group: item.groupcode,
                        content: item.title,
                        start: item.starttime,
                        end: `${item.endtime} 23:59:59`,
                        state: item.state,
                        className: CONFIG[item.state].type,
                        visibleFrameTemplate: `
                            <div class="sub">
                                <div class="members">
                                    ${memberHTML}
                                </div>
                            </div>
                        `,
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

<style lang="scss">
.sub {
    .members {
        display: flex;
        padding: 2px 5px;
        overflow: hidden;

        .item {
            font-size: 12px;
            background: #C0C4CC;
            line-height: 1em;
            padding: 2px;
            border-radius: 8px;
            color: white;

            & + .item {
                margin-left: 2px;
            }
        }
    }
}
</style>