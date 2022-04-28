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
                ></group-item>
            </draggable>
        </div>

        <group-add></group-add>
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
            tableData: [1, 2],
        }
    }
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