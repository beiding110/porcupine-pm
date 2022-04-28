<template>
    <el-card>
        <my-search v-model="pgData" @search="searchHandler">
            <template slot="btn">
                <my-btn type="new" @click="addHandler">新增</my-btn>
            </template>
        </my-search>
        
        <div class="list">
            <card-pro 
                v-for="(item, index) in tableData"
                :key="index"
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
			pgData:{
				proname:'' ,//项目名称
				xmlx:'' ,//项目类型
				shstate: '',
				onlyshowhistory: false,
			},

            loadingController: false
        }
    },
    computed: {

    },
    methods: {
        queryData() {
            // TODO: 获取项目列表
            this.tableData = [1,1,1,1,1,1,1,1,1,1,1]
        },
    },
    mounted: function() {
        this.queryData();
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .list{
        display: flex;
        flex-wrap: wrap;
        margin: -10px;
    }
</style>
