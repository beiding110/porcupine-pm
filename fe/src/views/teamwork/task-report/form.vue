<template>
    <my-form
    ref="form"
    v-model="form"
    table
    send-str
    submit-url="/taskreport/form"
    detail-url="/taskreport/detail"
    :before-send="beforeSend"
    @cancle="cancleHandler"
    :detail-extra="detailExtra"
    >
        <el-form-item 
        class="table-full-row"
        label="汇报日期" 
        prop="reporttime" 
        >
            <el-date-picker
                v-model="form.reporttime"
                type="date"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
            ></el-date-picker>
        </el-form-item>

        <el-form-item 
        label="消耗工时（h）" 
        prop="tasktime" 
        :rules="newRule('消耗工时' ,'required')"
        >
            <el-input-number
                v-model="form.tasktime"
                :min="0"
            ></el-input-number>
        </el-form-item>

        <el-form-item 
        label="人员" 
        prop="member" 
        :rules="newRule('人员' ,'required')"
        >
            <my-select 
                v-model="form.member" 
                :data="memberData"
                :props="{label:'name', value:'_id'}"
                :multiple="!data._id"
            ></my-select>
        </el-form-item>

        <el-form-item 
        class="table-full-row"
        label="任务描述" 
        prop="detail" 
        >
            <el-input 
                v-model="form.detail" 
                type="textarea" 
                :rows="4"
            ></el-input>
        </el-form-item>
    </my-form>
</template>

<script>
import FORM_PAGE_MIXIN from '@mixins/form-page';
import DIALOG_FORM_PAGE_MIXIN from '@mixins/dialog-form-page';

export default {
    mixins: [ FORM_PAGE_MIXIN, DIALOG_FORM_PAGE_MIXIN ],
    components: {
        
    },
    props: {
        data: {
            type: Object,
            default: () => ({}),
        },
    },
    data() {
        var member = this.data._id ? '' : [];

        return {
            form: {
                reporttime: '',
                tasktime: 0,
                member,
                detail: '',

                adduser: '',
                addtime: '',

                procode: '',
                taskcode: '',
            },

            memberData: [],
        };
    },
    computed: {
        detailExtra() {
            return {
                _id: this.data._id,
            };
        }
    },
    methods: {
        beforeSend(send, deny) {
            this.form.procode = this.data.procode;
            this.form.taskcode = this.data.taskcode;

            send();
        },
        queryTaskMember() {
            this.$get('/task/member', {
                taskcode: this.data.taskcode,
            }, data => {
                this.memberData = data;
            });
        },
    },
    created() {
        this.queryTaskMember();
    },
}
</script>

<style scoped lang="scss">

</style>
