<template>
    <div class="task-con">
        <div class="groups">
            <draggable 
            v-model="tableData" 
            group="groups"
            class="group-dragger"
            >
                <group-item 
                    v-for="(item, index) in tableData" 
                    :key="index"
                    :data="item"
                    @reload="queryData"
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
    },
    mounted() {
        this.queryData();
    },
};
</script>

<style lang="scss" scoped>
    .task-con{
        height: 100%;
        overflow-x: auto;
        white-space: nowrap;

        .groups{
            float: left;
            height: 100%;

            .group-dragger {
                height: 100%;
            }
        }
    }
</style>