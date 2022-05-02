<template>
    <my-form
    ref="form"
    v-model="form"
    table
    submit-url="/task/form"
    detail-url="/task/detail"
    @cancle="cancleHandler"
    :detail-extra="detailExtra"
    >
        <el-form-item 
        label="所属分组" 
        prop="groupcode" 
        :rules="newRule('所属分组' ,'required')"
        >
            <my-select
                placeholder=""
                v-model="form.groupcode"
                :data="groupData"
                :props="{label:'title',value:'_id'}"
            ></my-select>
        </el-form-item>

        <el-form-item 
        label="任务名称" 
        prop="title" 
        :rules="newRule('任务名称' ,'required')"
        >
            <el-input v-model="form.title"></el-input>
        </el-form-item>

        <el-form-item 
        label="工期（h）" 
        prop="duration" 
        :rules="newRule('工期' ,'required')"
        >
            <el-input-number
                v-model="form.duration"
                :min="0"
            ></el-input-number>
        </el-form-item>

        <el-form-item 
        label="优先级" 
        prop="level" 
        >
            <el-radio-group v-model="form.level">
                <el-radio label="h">高</el-radio>
                <el-radio label="m">中</el-radio>
                <el-radio label="l">低</el-radio>
            </el-radio-group>
        </el-form-item>

        <!-- <el-form-item 
        class="table-full-row"
        label="人员" 
        prop="member" 
        :rules="newRule('人员' ,'required')"
        >
            <people-editor v-model="form.people"></people-editor>
        </el-form-item> -->

        <el-form-item 
        label="计划开始" 
        prop="starttime" 
        >
            <el-date-picker
                v-model="form.starttime"
                type="date"
                format="yyyy/MM/dd"
                value-format="yyyy/MM/dd"
            ></el-date-picker>
        </el-form-item>

        <el-form-item 
        label="计划结束" 
        prop="endtime" 
        >
            <el-date-picker
                v-model="form.endtime"
                type="date"
                format="yyyy/MM/dd"
                value-format="yyyy/MM/dd"
            ></el-date-picker>
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

import PeopleEditor from '../project/components/people-editor';

export default {
    mixins: [ FORM_PAGE_MIXIN, DIALOG_FORM_PAGE_MIXIN ],
    components: {
        PeopleEditor,
    },
    props: {
        data: {
            type: Object,
            default: () => ({}),
        },
    },
    data: () => ({
        form: {
            proname: '',
            proid: '',
            groupcode: '',
            groupid: '',
            title: '',
            duration: 0,
            level: 'm',
            starttime: '',
            endtime: '',
            detail: '',
            member: [],
        },

        groupData: [],
    }),
    computed: {
        detailExtra() {
            return {
                taskcode: this.data._id,
            };
        }
    },
    methods: {
        saveHandler(type, cb) {
            cb && cb();
        },
        beforeSend(send, deny) {
            send();
        },
        queryGroupData() {
            this.$get('/taskgroup/list', {
                procode: this.$route.params.pocode,
            }, data => {
                this.groupData = data;
            });
        },
    },
    created() {
        this.queryGroupData();
    },
}
</script>

<style scoped lang="scss">

</style>
