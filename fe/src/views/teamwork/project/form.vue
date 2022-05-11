<template>
    <my-form
    ref="form"
    v-model="form"
    table
    send-str
    submit-url="/project/form"
    detail-url="/project/detail"
    @cancle="cancleHandler"
    :detail-extra="detailExtra"
    >
        <el-form-item 
        class="table-full-row"
        label="项目名称" 
        prop="proname" 
        :rules="newRule('项目名称' ,'required')"
        >
            <el-input v-model="form.proname"></el-input>
        </el-form-item>

        <el-form-item 
        class="table-full-row"
        label="项目描述" 
        prop="detail" 
        >
            <el-input 
                v-model="form.detail" 
                type="textarea" 
                :rows="4"
            ></el-input>
        </el-form-item>

        <el-form-item 
        class="table-full-row"
        label="人员" 
        prop="member" 
        :rules="newRule('人员' ,'required')"
        >
            <people-editor v-model="form.member"></people-editor>
        </el-form-item>

        <el-form-item 
        class="table-full-row"
        label="封面主题色" 
        prop="covercolor" 
        >
            <el-color-picker v-model="form.covercolor"></el-color-picker>
        </el-form-item>
    </my-form>
</template>

<script>
import FORM_PAGE_MIXIN from '@mixins/form-page';
import DIALOG_FORM_PAGE_MIXIN from '@mixins/dialog-form-page';

import PeopleEditor from './components/people-editor';

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
            detail: '',
            member: [],
            covercolor: '',
        }
    }),
    computed: {
        detailExtra() {
            return {
                procode: this.data._id
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
    },
    created() {

    }
}
</script>

<style scoped lang="scss">

</style>
