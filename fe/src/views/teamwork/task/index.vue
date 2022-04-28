<template>
    <div class="task-con">
        <group-item></group-item>

        <group-add></group-add>
    </div>
</template>

<script>
import GroupItem from './components/group-item';
import GroupAdd from './components/group-add';

export default {
    components: {
        GroupItem,
        GroupAdd,
    },
};
</script>

<style lang="scss" scoped>
    .task-con{
        height: 100%;
        overflow-x: auto;
        white-space: nowrap;
    }
</style>