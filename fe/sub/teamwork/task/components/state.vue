<template>
    <el-tag 
    :type="mapItem.type"
    :size="size"
    >
        <i 
            v-if="mapItem.icon"
            :class="mapItem.icon"
        ></i>
        {{mapItem.text}}
    </el-tag>
</template>

<script>
import CONFIG from '../config/state';

export default {
    props: {
        data: {
            type: [Number, String],
            default: 0,
        },
        size: {
            type: String,
            default: 'small',
        },
    },
    data() {
        return {
            config: CONFIG,
        }
    },
    computed: {
        mapItem() {
            return this.config[this.data];
        },
    },
}
</script>