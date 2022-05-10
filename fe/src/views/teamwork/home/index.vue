<template>
    <div class="home">
        <el-row :gutter="10" class="com-item">
            <el-col :span="12">
                <el-card>
                    <cascader-all-member></cascader-all-member>
                </el-card>
            </el-col>
            <el-col :span="12">
                <task-alive></task-alive>
            </el-col>
        </el-row>

        <hotspot-map class="com-item"></hotspot-map>
    </div>
</template>

<script>
import CascaderAllMember from '../task-report/components/cascader-all-member';
import HotspotMap from './components/hotspot-map';
import TaskAlive from './components/task-alive';

export default {
    components: {
        CascaderAllMember,
        HotspotMap,
        TaskAlive,
    },
    data() {
        return {

        }
    },
    created() {
        
    },
}
</script>

<style lang="scss" scoped>
    .home{
        .com-item{
            & + .com-item{
                margin-top: 10px;
            }
        }
    }
</style>