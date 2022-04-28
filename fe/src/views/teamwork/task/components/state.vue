<template>
    <el-tag 
    :type="mapItem.type"
    size="small"
    >
        <i 
            v-if="mapItem.icon"
            :class="mapItem.icon"
        ></i>
        {{mapItem.text}}
    </el-tag>
</template>

<script>
export default {
    props: {
        data: {
            type: Number,
            default: 0,
        },
    },
    data() {
        return {
            config: {
                0: {
                    text: '待办',
                    type: 'info',
                    icon: 'el-icon-remove'
                },
                1: {
                    text: '未开始',
                    type: 'warning',
                    icon: 'el-icon-question'
                },
                2: {
                    text: '进行中',
                    type: 'primary',
                    icon: 'el-icon-info'
                },
                3: {
                    text: '已完成',
                    type: 'success',
                    icon: 'el-icon-success'
                },
            }
        }
    },
    computed: {
        mapItem() {
            return this.config[this.data];
        },
    },
}
</script>