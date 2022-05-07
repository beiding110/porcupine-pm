<template>
    <div class="home">
        <el-card>
            <cascader-all-member></cascader-all-member>
        </el-card>
    </div>
</template>

<script>
import CascaderAllMember from '../task-report/components/cascader-all-member';

export default {
    components: {
        CascaderAllMember,
    },
}
</script>