<template>
    <div class="home">
        <el-card class="com-item">
            <cascader-all-member></cascader-all-member>
        </el-card>

        <hotspot-map class="com-item"></hotspot-map>
    </div>
</template>

<script>
import CascaderAllMember from '../task-report/components/cascader-all-member';
import HotspotMap from './components/hotspot-map';

export default {
    components: {
        CascaderAllMember,
        HotspotMap,
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
        margin: -10px;

        .com-item{
            margin: 10px;
        }
    }
</style>