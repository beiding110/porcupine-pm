<template>
    <div class="settings">
        <el-row :gutter="10" class="com-item">
            <el-col :span="12">
                <project-member></project-member>
            </el-col>
            <el-col :span="12">
                
            </el-col>
        </el-row>
    </div>
</template>

<script>
import ProjectMember from './components/project-member';

export default {
    components: {
        ProjectMember,
    },
    data() {
        return {

        };
    },
    created() {
        
    },
}
</script>

<style lang="scss" scoped>
    .settings{
        .com-item{
            & + .com-item{
                margin-top: 10px;
            }
        }
    }
</style>