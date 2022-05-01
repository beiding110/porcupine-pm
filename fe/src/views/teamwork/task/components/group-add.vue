<template>
    <card class="group-add">
        <div class="btn-add" v-if="!formShow" @click="showForm">
            <i class="el-icon-plus"></i>
            新建分组
        </div>

        <div class="form-add" v-else>
            <el-input 
                ref="input"
                v-model="form.title" 
                size="small"
                @blur="blurHandler"
                @keydown.native.enter="submitHandler"
            ></el-input>

            <div class="btns">
                <el-button 
                size="mini" 
                @click="closeHandler"
                >
                    取消
                </el-button>

                <el-button 
                size="mini" 
                type="primary"
                @click="submitHandler"
                >
                    确定
                </el-button>
            </div>
        </div>
    </card>
</template>

<script>
import Card from './card';

export default {
    components: {
        Card,
    },
    data() {
        return {
            formShow: false,

            form: {
                groupname: '',
            },
        };
    },
    methods: {
        showForm() {
            this.formShow = true;
            this.$nextTick(() => {
                this.$refs.input.focus();
            });
        },
        closeHandler() {
            this.formShow = false;
            
            this.resetForm();
        },
        resetForm() {
            this.form = {
                groupname: '',
            };
        },
        submitHandler() {
            if (!this.form.title) {
                return;
            }

            this.$post('/taskgroup/form', {
                ...this.form,
                procode: this.$route.params.procode,
            }, () => {
                showMsg('添加分组成功');

                this.formShow = false;
            
                this.resetForm();

                this.$emit('reload');
            });
        },
        blurHandler() {
            if (!this.form.title) {
                this.closeHandler();
            }
        }
    }
};
</script>

<style lang="scss" scoped>
    @import '@css/var.scss';

    .group-add{
        display: inline-block;
        vertical-align: top;
        width: 280px;
        margin-left: 20px;
        box-sizing: border-box;
        
        .btn-add{
            text-align: center;
            cursor: pointer;

            &:hover{
                color: $primaryColor;
            }
        }

        .form-add{
            .btns{
                text-align: right;
                margin-top: 10px;
            }
        }
    }
</style>