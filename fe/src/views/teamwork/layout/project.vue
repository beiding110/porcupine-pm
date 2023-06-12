<template>
    <div class="layout-pro">
        <div class="top-nav">
            <shift-pro></shift-pro>

            <div class="navs">
                <div 
                class="item"
                v-for="(item, index) in nav"
                :key="index"
                :class="{active: calcActive(item)}"
                @click="$router.replace(item.path)"
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
import {checkAuthInArr} from '@/js/authority';
import ShiftPro from './components/shift-pro';

export default {
    components: {
        ShiftPro,
    },
    data() {
        return {
            currentPro: '',
        };
    },
    computed: {
        nav() {
            return checkAuthInArr([
                {
                    title: '任务组',
                    path: `/teamwork/${this.$route.params.procode}/task`,
                },
                {
                    title: '状态组',
                    path: `/teamwork/${this.$route.params.procode}/state`,
                },
                {
                    title: '工时',
                    path: `/teamwork/${this.$route.params.procode}/taskreport`,
                },
                {
                    title: '时间轴',
                    path: `/teamwork/${this.$route.params.procode}/timeline`,
                },
                {
                    title: '甘特图',
                    path: `/teamwork/${this.$route.params.procode}/gantt`,
                    auth: 'gantt-view'
                },
            ]);
        }
    },
    methods: {
        calcActive(item) {
            return this.$route.path === item.path;
        },
    },
    created() {
        
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
            padding: 0 10px;
            position: relative;

            .bread{
                display: flex;
                align-items: center;
            }

            .navs{
                display: flex;
                height: $topNavHeight;
                width: 360px;
                position: absolute;
                left: 50%;
                transform: translate(-50%);

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