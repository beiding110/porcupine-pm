<template>
    <el-tooltip 
    class="pro-info-tooltip" 
    effect="dark" 
    :content="data.proname" 
    placement="top"
    >
        <div 
        class="pro-info"
        :style="{background:`${themeColor}`}"
        >
            {{firstName}}
        </div>
    
    </el-tooltip>
</template>

<script>
export default {
    props: {
        data: {
            type: Object,
            default: () => ({}),
        },
    },
    computed: {
        firstName() {
            var proname = this.data.proname;

            if (!proname) {
                return '-';
            }

            return proname.slice(0, 1);
        },
        themeColor() {
            if (this.data.covercolor) {
                return this.data.covercolor;
            }

            var id = this.data._id;

            if (!id) {
                return '#C0CFE3';
            }

            return `#${id.slice(5, 9)}${id.slice(-2, id.length)}`;
        },
    },
};
</script>

<style lang="scss" scoped>
    .pro-info{
        display: flex;
        width: 32px;
        height: 32px;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        border-radius: 4px;
        color: white;
        position: relative;
        line-height: 1em;
    }
</style>