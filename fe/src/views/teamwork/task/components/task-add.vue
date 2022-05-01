<template>
    <card class="task-add">
        <div class="btn-add" v-if="!formShow" @click="showForm">
            <i class="el-icon-plus"></i>
            添加新任务
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

        <my-dialog 
        v-model="dialogVisible" 
        title="新建任务"
        width="700px"
        >
            <form-page
                v-if="dialogVisible"
                @cancle="dialogClose"
            ></form-page>
        </my-dialog>
    </card>
</template>

<script>
import DIALOG_LIST_MIXIN from '@mixins/dialog-list-page';

import Card from './card';
import FormPage from '../form';

export default {
    mixins: [DIALOG_LIST_MIXIN],
    components: {
        Card,
        FormPage,
    },
    data() {
        return {
            formShow: false,

            form: {
                title: '',
            },
        };
    },
    methods: {
        showForm() {
            this.formShow = true;
            this.$nextTick(() => {
                this.$refs.input.focus();
            });

            // this.dialogShow();
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
            if (!this.form.groupname) {
                return;
            }

            // TODO: 提交创建新任务

            this.formShow = false;
            
            this.resetForm();
        },
        blurHandler() {
            if (!this.form.groupname) {
                this.closeHandler();
            }
        },
    },
};
</script>

<style lang="scss" scoped>
    @import '@css/var.scss';

    .task-add{
        display: inline-block;
        vertical-align: top;
        width: 280px;
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