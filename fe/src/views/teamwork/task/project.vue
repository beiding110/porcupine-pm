<template>
    <div class="task-con">
        <div class="groups">
            <draggable 
            v-model="tableData" 
            group="groups"
            class="group-dragger"
            @change="groupDragHandler"
            >
                <group-item 
                    v-for="(item, index) in tableData" 
                    :key="index"
                    :data="item"
                    @reload="queryData"
                    @taskdrag="taskDragHandler"
                ></group-item>
            </draggable>
        </div>

        <group-add
            @reload="queryData"
        ></group-add>
    </div>
</template>

<script>
import GroupItem from './components/group-item';
import GroupAdd from './components/group-add';
import Draggable from 'vuedraggable';

export default {
    components: {
        GroupItem,
        GroupAdd,
        Draggable,
    },
    data() {
        return {
            tableData: [],

            taskUpdateLock: false,
        }
    },
    methods: {
        queryData() {
            this.$get('/taskgroup/list', {
                procode: this.$route.params.procode,
            }, data => {
                this.tableData = data;
            });
        },
        groupDragHandler() {
            this.$post('/taskgroup/updateorder', this.tableData.map((item, index) => {
                return {
                    _id: item._id,
                    order: index,
                };
            }), () => {

            }, true);
        },
        taskDragHandler() {
            if (this.taskUpdateLock) {
                return;
            }

            this.taskUpdateLock = true;

            this.tableData.forEach(group => {
                group.task.forEach((item, index) => {
                    item.order = index;
                    item.groupcode = group._id;
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

    .task-con{

        .groups{
            float: left;
        }
    }
</style>