<template>
    <my-form
    ref="form"
    v-model="form"
    table
    :submit-url="`${getGetters('twUrl')}/xmgl/project/add`"
    :detail-url="`${getGetters('twUrl')}/xmgl/project/detail`"
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
        prop="people" 
        :rules="newRule('人员' ,'required')"
        >
            <people-editor v-model="form.people"></people-editor>
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
        
    },
    data: () => ({
        form: {
            proname: '',
            detail: '',
            people: [],
        }
    }),
    computed: {
        detailExtra() {
            return {
                rowguid: this.getQuery('rowguid')
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
