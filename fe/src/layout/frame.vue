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
                :index="item.url"
                >
                    <i :class="item.imgpath"></i>
                    <span slot="title">{{item.text}}</span>
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
import {checkAuthInArr} from '@js/authority';
import nav from '@config/nav.js';

import lessVars from '@css/var.scss';

export default {
    components: {
        
    },
    data () {
        return {
            colors: lessVars,
            nav: checkAuthInArr(nav),
        };
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
