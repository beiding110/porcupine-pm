<template>
    <div class="layout">
        <div class="left-nav">
            <el-menu 
            collapse
            router
            :background-color="colors.navBgColor"
            :text-color="colors.navTextColor"
            :active-text-color="colors.navTextActiveColor"
            >
                <el-menu-item
                v-for="(item, index) in nav" 
                :key="index"
                :index="item.path"
                >
                    <i :class="item.icon"></i>
                    <span slot="title">{{item.title}}</span>
                </el-menu-item>
            </el-menu>
        </div>
        
        <div class="view">
            <div class="view-box">
                <router-view :key="$route.fullPath" />
            </div>
        </div>
    </div>
</template>

<script>
import lessVars from '@/css/var.scss'

export default {
    components: {
        
    },
    data () {
        return {
            colors: lessVars,

            nav: [
                {
                    title: '首页',
                    path: '/teamwork/index',
                    icon: 'el-icon-s-home',
                },
                {
                    title: '项目',
                    path: '/teamwork/project',
                    icon: 'el-icon-s-management',
                },
                {
                    title: '归档数据',
                    path: '/teamwork/file',
                    icon: 'el-icon-document',
                },
            ],
        }
    },
    computed: {
        
    },
    methods: {
        
    },
    created() {
        
    },
    mounted: function() {
        // this.$store.dispatch('queryUserInfo');
    },
    beforeDestroy() {
        
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import './css/common.scss';
</style>
