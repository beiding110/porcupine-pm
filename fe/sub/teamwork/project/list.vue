<template>
    <el-card class="paoject-main">
        <my-search v-model="pgData" @search="queryData">
            <template slot="btn">
                <my-btn 
                v-auth="'project-edit'"
                type="new" 
                @click="addHandler"
                >
                    新增
                </my-btn>
            </template>
        </my-search>
        
        <div class="list">
            <draggable 
            v-model="g0" 
            group="groups"
            class="group-dragger g0"
            @change="proDragHandler"
            >
                <card-pro 
                    v-for="item in g0"
                    :key="item._id"
                    :data="item"
                    @edit="editHandler(item)"
                    @reload="queryData"
                ></card-pro>
            </draggable>

            <draggable 
            v-model="g1" 
            group="groups"
            class="group-dragger g1"
            @change="proDragHandler"
            >
                <card-pro 
                    v-for="item in g1"
                    :key="item._id"
                    :data="item"
                    @edit="editHandler(item)"
                    @reload="queryData"
                ></card-pro>
            </draggable>

            <draggable 
            v-model="g2" 
            group="groups"
            class="group-dragger g2"
            @change="proDragHandler"
            >
                <card-pro 
                    v-for="item in g2"
                    :key="item._id"
                    :data="item"
                    @edit="editHandler(item)"
                    @reload="queryData"
                ></card-pro>
            </draggable>
        </div>

        <my-dialog 
        v-model="dialogVisible" 
        title="编辑项目"
        width="600px"
        >
            <form-page
                v-if="dialogVisible"
                :data="form"
                @cancel="dialogClose"
            ></form-page>
        </my-dialog>
    </el-card>
</template>

<script>
import LIST_MIXIN from '@mixins/list-page';
import DIALOG_LIST_MIXIN from '@mixins/dialog-list-page';

import Draggable from 'vuedraggable';

import CardPro from './components/card-pro';
import FormPage from './form';

export default {
    mixins: [ LIST_MIXIN, DIALOG_LIST_MIXIN ],
    components: {
        Draggable,
        CardPro,
        FormPage,
    },
    props: [],
    data () {
        return {
            tableData: [],
            pgData:{},
            
            loadingController: false,

            g0: [],
            g1: [],
            g2: [],

            proUpdateLock: false,
        };
    },
    computed: {
        
    },
    watch: {
        tableData: {
            handler(val) {
                this.g0 = val.filter(item => !item.groupcode || item.groupcode === 'g0');
                this.g1 = val.filter(item => item.groupcode === 'g1');
                this.g2 = val.filter(item => item.groupcode === 'g2');
            }, 
            deep: true,
        },
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
        proDragHandler() {
            if (this.proUpdateLock) {
                return;
            }

            this.proUpdateLock = true;

            ['g0', 'g1', 'g2'].forEach((key) => {
                this[key].forEach((item, index) => {
                    item.groupcode = key;
                    item.order = index;
                });
            });

            this.$post('/project/updatedrag', [
                ...this.g0,
                ...this.g1,
                ...this.g2,
            ], () => {
                this.proUpdateLock = false;
            }, true);
        },
    },
    mounted: function() {
        this.queryData();
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
    @import '@css/var.scss';

    .paoject-main{
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
    }

    .list{
        margin: -10px;
        margin-top: 0;
        height: calc(100vh - 93px);
        overflow: auto;

        .group-dragger{
            display: flex;
            flex-wrap: wrap;
            align-content: flex-start;

            border: 1px dashed $primaryColor5;

            min-height: calc((100vh - 123px) / 3);

            & + .group-dragger{
                margin-top: 10px;
            }

            &.g1 {
                border-color: $warningColor5;
            }

            &.g2 {
                border-color: $successColor5;
            }
        }
    }
</style>
