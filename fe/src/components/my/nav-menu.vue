<template>
    <div class="infinite-sub-menu">
        <template v-for="childItem in list">

            <template v-if="!!childItem.children">
                <el-submenu :index="childItem.id" :key="childItem.id">
                    <template slot="title">
                        <!-- <i 
                            class="iconfont nav-icon" 
                            v-if="childItem.imgpath" 
                            v-html="childItem.imgpath"
                        ></i> -->
                        <i 
                            class="nav-icon" 
                            :class="childItem.imgpath"
                            v-if="childItem.imgpath" 
                        ></i>

                        <span>{{ childItem.text }}</span>
                    </template>

                    <my-nav-menu :list="childItem.children" :props="props"></my-nav-menu>
                </el-submenu>
            </template>
            <template v-else>
                <el-menu-item :index="childItem.url" :key="childItem.id">
                    <!-- <i 
                        class="iconfont nav-icon" 
                        v-if="childItem.imgpath" 
                        v-html="childItem.imgpath"
                    ></i> -->

                    <i 
                        class="nav-icon" 
                        :class="childItem.imgpath"
                        v-if="childItem.imgpath" 
                    ></i>

                    <span>{{ childItem.text }}</span>
                </el-menu-item>
            </template>

        </template>
    </div>
</template>

<script>
export default {
    props: {
        // 导航数据
        list: {
            type: Array,
            default: function() {
                return []
            }
        },
        // 配置
        props: {
            type: Object,
            default: function() {
                return {
                    url: 'url'
                }
            }
        }
    },
    data () {
        return {

        }
    },
    methods: {
        sliceUrl: function (href) {
            if (href) {
                if (/list/.test(href)) {
                    return href.split('/').slice(0, -1).join('/');
                } 
                
                return href;
            } 
            
            return '';
        }
    },
    mounted: function() {

    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.nav-icon{
    color: inherit;

    & + span{
        margin-left: .5em;
    }
}
</style>
