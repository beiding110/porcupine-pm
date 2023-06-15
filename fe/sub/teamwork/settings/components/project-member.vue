<template>
    <el-card 
    >
        <div slot="header">
            项目成员管理
        </div>

        <my-table
        :data="tableData"
        >
            <el-table-column label="姓名" prop="name"></el-table-column>

            <el-table-column label="备注" prop="detail"></el-table-column>

            <el-table-column label="账号绑定" width="80px">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.userid" type="success" size="mini">已绑定</el-tag>
                    <el-tag v-else type="info" size="mini">未绑定</el-tag>
                </template>
            </el-table-column>

            <el-table-column label="操作" width="80px">
                <template slot-scope="scope">
                    <el-button type="text" icon="el-icon-edit" @click="editHandler(scope.row)">编辑</el-button>
                </template>
            </el-table-column>
        </my-table>

        <my-dialog v-model="dialogVisible" width="400px">
            <my-form 
            v-if="dialogVisible"
            v-model="form" 
            @cancel="dialogClose"
            @submit="submitHandler"
            >
                <el-form-item label="姓名" prop="name" :rules="[...newRule('姓名', 'required'), {validator:nameRules, trigger:['blur', 'change']}]">
                    <el-input
                        v-model="form.name"
                    ></el-input>
                </el-form-item>

                <el-form-item label="备注">
                    <el-input
                        v-model="form.detail"
                    ></el-input>
                </el-form-item>

                <el-form-item label="绑定账号" prop="userid" :rules="[{validator:useridRules, trigger:['blur', 'change']}]">
                    <el-input
                        v-model="form.userid"
                    ></el-input>
                </el-form-item>
            </my-form>
        </my-dialog>
    </el-card>
</template>

<script>
import DIALOG_LIST_MIXIN from '@mixins/dialog-list-page';

export default {
    mixins: [DIALOG_LIST_MIXIN],
    data() {
        return {
            tableData: [],
        };
    },
    methods: {
        queryData() {
            this.$get('/projectmember/list', data => {
                var tableData = data;

                this.tableData = tableData;
            });
        },
        nameRules(rule, value, callback) {
            if (this.tableData.some(item => {
                return (
                    item._id !== this.form._id
                    && item.name === value
                );
            })) {
                return callback(new Error('该姓名已存在'));
            }

            callback();
        },
        useridRules(rule, value, callback) {
            if (!value) {
                callback();
                return;
            }
            
            this.$post('/user/checkexistbyid', {
                userid: value,
            }, data => {
                if (!data) {
                    return callback(new Error('不存在该账号'));
                } 

                callback();
            });            
        },
        submitHandler() {
            this.$post('/projectmember/form', this.form, data => {
                this.queryData();
                this.dialogClose();
            });
        },
    },
    mounted() {
        this.queryData();
    },
};
</script>