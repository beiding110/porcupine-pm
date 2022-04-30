<template>
    <el-card class="paoject-main">
        <my-search v-model="pgData" @search="queryData">
            <template slot="btn">
                <my-btn type="new" @click="addHandler">新增</my-btn>
            </template>
        </my-search>
        
        <div class="list">
            <card-pro 
                v-for="item in tableData"
                :key="item._id"
                :data="item"
                @edit="editHandler(item)"
                @reload="queryData"
            ></card-pro>
        </div>

        <my-dialog 
        v-model="dialogVisible" 
        title="编辑项目"
        width="600px"
        >
            <form-page
                v-if="dialogVisible"
                :data="form"
                @cancle="dialogClose"
            ></form-page>
        </my-dialog>
    </el-card>
</template>

<script>
import LIST_MIXIN from '@mixins/list-page';
import DIALOG_LIST_MIXIN from '@mixins/dialog-list-page';

import CardPro from './components/card-pro';
import FormPage from './form';

export default {
    mixins: [ LIST_MIXIN, DIALOG_LIST_MIXIN ],
    components: {
        CardPro,
        FormPage,
    },
    props: [],
    data () {
        return {
            tableData: [],
            pgData:{},
            
            loadingController: false
        };
    },
    computed: {

    },
    methods: {
        queryData() {
            this.$get('/project/list', this.pgData, data => {
                this.tableData = data;
            });
        },
        reloadHandler() {
            this.queryData();
        },
    },
    mounted: function() {
        this.queryData();
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .paoject-main{
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
    }

    .list{
        display: flex;
        flex-wrap: wrap;
        margin: -10px;
    }
</style>
