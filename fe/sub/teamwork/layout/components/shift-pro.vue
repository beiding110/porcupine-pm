<template>
    <div class="pro-shift">
        <el-select 
        class="select"
        v-model="currentPro" 
        size="small"
        @change="changeHandler"
        >
            <el-option
            v-for="item in tableData"
            :key="item._id"
            :label="item.proname"
            :value="item._id"
            >
                <div class="pro-item">
                    <pro-info-icon :data="item"></pro-info-icon>
                    <div class="proname">
                        {{item.proname}}
                    </div>
                </div>
            </el-option>

            <div slot="prefix">
                <pro-info-icon :data="currentProData"></pro-info-icon>
            </div>
        </el-select>
    </div>
</template>

<script>
import MODEL_MIXIN from '@mixins/model';

import ProInfoIcon from '../../project/components/pro-info-icon';

import {mapGetters} from 'vuex';

export default {
    mixins: [MODEL_MIXIN],
    components: {
        ProInfoIcon,
    },
    data() {
        return {
            currentPro: '',
            lastPro: '',
        };
    },
    computed: {
        ...mapGetters({
            tableData: 'projects',
        }),
        currentProData() {
            return this.tableData.filter(item => item._id === this.currentPro)[0];
        },
    },
    methods: {
        queryData() {
            // this.$get('/project/list', this.pgData, data => {
            //     this.tableData = data;

            //     this.currentPro = this.lastPro = this.$route.params.procode;
            // });

            this.$store.dispatch('queryProjects', () => {
                this.currentPro = this.lastPro = this.$route.params.procode;
            });
        },
        changeHandler(val) {
            var nextPro = val,
                fullPath = this.$route.fullPath;

            fullPath = fullPath.replace(this.lastPro, nextPro);

            this.$router.replace(fullPath);
        },
    },
    created() {
        this.queryData();
    },
};
</script>

<style lang="scss" scoped>
    .pro-shift{
        display: flex;
        
        .select{
            display: flex;
            align-items: center;

            ::v-deep {
                .el-input__inner{
                    border-radius: 0;
                    // border-left: none;
                    // border-top: none;
                    // border-right: none;
                    border: none;
                    padding-left: 42px;
                }
            }
        }
    }

    .pro-item{
        display: flex;

        .proname{
            margin-left: 10px;
        }
    }
</style>