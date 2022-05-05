<template>
    <div class="layout-pro">
        <div class="top-nav">
            <div class="bread">
                <breadcrumb></breadcrumb>
            </div>

            <div class="navs">
                <div 
                class="item"
                v-for="(item, index) in nav"
                :key="index"
                :class="{active: calcActive(item)}"
                @click="goto(item.path)"
                >
                    {{item.title}}
                </div>
            </div>
        </div>

        <div class="main">
            <router-view/>
        </div>
    </div>
</template>

<script>
import Breadcrumb from '@/layout/components/breadcrumb';

export default {
    components: {
        Breadcrumb,
    },
    data() {
        return {
            
        };
    },
    computed: {
        nav() {
            return [
                {
                    title: '任务组',
                    path: `/teamwork/${this.$route.params.procode}/task/index`,
                },
                {
                    title: '工时',
                    path: `/teamwork/${this.$route.params.procode}/taskreport/list`,
                },
            ];
        }
    },
    methods: {
        calcActive(item) {
            return this.$route.path === item.path;
        },
    },
}
</script>

<style lang="scss" scoped>
    @import '@css/var.scss';

    .layout-pro{
        height: 100%;
        position: relative;

        $topNavHeight: 40px;

        .top-nav{
            display: flex;
            height: $topNavHeight;
            margin: -10px;
            margin-bottom: 10px;
            background: white;
            padding: 0 20px;

            .bread{
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .navs{
                display: flex;
                height: $topNavHeight;
                width: 240px;
                margin: 0 auto;

                .item{
                    display: flex;
                    flex: 1;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    position: relative;

                    &:hover{
                        color: $primaryColor;
                    }

                    &.active{
                        color: $primaryColor;
                        
                        &:after{
                            content: '';
                            position: absolute;
                            bottom: 0;
                            left: 0;
                            width: 100%;
                            height: 2px;
                            background: $primaryColor;
                        }
                    }
                }
            }
        }

        .main{
            height: calc(100% - $topNavHeight);
        }
    }
</style>