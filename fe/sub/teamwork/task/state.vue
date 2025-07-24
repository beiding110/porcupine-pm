<template>
    <div class="task-con">
        <div class="groups">
            <group-item 
                v-for="(item, index) in tableData" 
                :key="index"
                :data="item"
                :state="item.state"
                @reload="queryData"
                @taskdrag="taskDragHandler"
            ></group-item>
        </div>
    </div>
</template>

<script>
import GroupItem from './components/group-item';

export default {
    components: {
        GroupItem,
    },
    data() {
        return {
            tableData: [],

            taskUpdateLock: false,
        }
    },
    methods: {
        queryData() {
            this.$get('/task/list-state', {
                procode: this.$route.params.procode,
            }, data => {
                this.tableData = data;
            });
        },
        taskDragHandler() {
            if (this.taskUpdateLock) {
                return;
            }

            this.taskUpdateLock = true;

            this.tableData.forEach(group => {
                group.task.forEach((item, index) => {
                    item.order = index;
                    item.state = group.state;
                });
            });
            
            this.$post('/task/updatedrag', this.tableData, () => {
                this.taskUpdateLock = false;
            }, true);
        },
    },
    mounted() {
        this.queryData();
    },
};
</script>

<style lang="scss" scoped>
    @import './style/groups.scss';
</style>