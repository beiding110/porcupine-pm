<template>
    <div class="people-editor">
        <el-tooltip 
        v-for="(item, index) in model"
        :key="item._id"
        class="item" 
        effect="dark" 
        :content="item.name" 
        placement="top"
        >
            <div 
            class="people-item"
            >
                {{firstName(item.name)}}

                <i 
                    v-if="!readonly"
                    class="el-icon-close btn-del" 
                    @click="delHandler(index)"
                ></i>
            </div>
        </el-tooltip>

        <el-button 
            class="btn-add"
            v-if="!readonly"
            icon="el-icon-user" 
            circle
            @click="addHandler"
        ></el-button>
    </div>
</template>

<script>
import MODEL_MIXIN from '@mixins/model';

export default {
    mixins: [MODEL_MIXIN],
    props: {
        value: {
            type: Array,
            default: () => [],
        },
        readonly: {
            type: Boolean,
            default: false,
        },
    },
    methods: {
        addHandler() {
            this.$prompt('请输入人员姓名', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputValidator: val => {
                    if (!val) {
                        return '请输入姓名';
                    }

                    if (this.model.some(item => {
                        return item.name === val;
                    })) {
                        return '请勿输入重复的人员';
                    }

                    return true;
                }
            }).then(({ value }) => {
                this.model.push({
                    name: value,
                });
            });
        },
        delHandler(index) {
            this.model.splice(index, 1);
        },
        firstName(name) {
            if (!name) {
                return '';
            }

            return name.slice(0, 1);
        },
    }
};
</script>

<style lang="scss" scoped>
    @import '@css/var.scss';

    $itemSize: 32px;

    .people-editor{
        display: flex;
        flex-wrap: wrap;

        .people-item{
            display: flex;
            width: $itemSize;
            height: $itemSize;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            border: 1px solid $primaryColor;
            background: $primaryColor;
            border-radius: 50%;
            color: white;
            margin: 4px 0;
            margin-right: 8px;
            position: relative;
            line-height: 1em;

            .btn-del{
                display: none;
                cursor: pointer;
                align-items: center;
                justify-content: center;
                background: $dangerColor;
                color: white;
                position: absolute;
                right: -4px;
                top: -4px;
                border-radius: 50%;
                padding: 2px;
            }

            &:hover{
                .btn-del{
                    display: flex;
                }
            }
        }

        .btn-add{
            margin: 4px 0;
        }
    }
</style>