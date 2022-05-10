<template>
    <el-card class="hotspot-map">
        <div class="menu">
            <el-form class="menu-navi" inline size="small">                
                <el-form-item>
                    <el-date-picker
                        v-model="dateRange"
                        type="daterange"
                        size="small"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                        @change="queryData"
                    ></el-date-picker>
                </el-form-item>

                <el-form-item>
                    <my-select 
                        placeholder="成员"
                        v-model="member" 
                        :props="{label:'name', value:'_id'}"
                        :url="`/projectmember/list`"
                        @select="queryData"
                    ></my-select>
                </el-form-item>
            </el-form>
        </div>

        <hotspot-map
            :data="data"
            :range="dateRange"
        ></hotspot-map>
    </el-card>
</template>

<script>
import HotspotMap from '@components-sys/hotspot-map';

export default {
    components: {
        HotspotMap,
    },
    data() {
        var firstOfYear = new Date(),
            lastDayOfYear = new Date();

        firstOfYear.setMonth(0);
        firstOfYear.setDate(1);

        lastDayOfYear.setMonth(11);
        lastDayOfYear.setDate(31);

        firstOfYear = firstOfYear.pattern('yyyy-MM-dd');
        lastDayOfYear = lastDayOfYear.pattern('yyyy-MM-dd');

        return {
            data: [],

            dateRange: [firstOfYear, lastDayOfYear],
            member: '',
        };
    },
    methods: {
        queryData() {
            this.$get('/taskreport/hotmap', {
                starttime: this.dateRange[0],
                endtime: this.dateRange[1],
                member: this.member,
            }, data => {
                this.data = data;
            });
        },
    },
    mounted() {
        this.queryData();
    },
}
</script>

<style lang="scss" scoped>
    
</style>