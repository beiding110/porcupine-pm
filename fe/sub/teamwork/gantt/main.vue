<template>
    <div class="time-line">
        <el-card>
            <gantt ref="gantt"
                :data="tableData"
                :height="autoHeight"
                :import-extra="{procode: $route.params.procode}"
                @import="queryData"
                @save="saveHandler"
                v-loading.sync="loadingController"
            ></gantt>
        </el-card>
    </div>
</template>

<script>
import Gantt from '@components-sys/gantt';

export default {
    components: {
        Gantt,
    },
    data() {
        return {
            tableData: {
				data: [
					// {id: 1, type: 'project', text: 'The Project', progress: 0.6, open: true},
					// {id: 2, text: 'Task #1', start_date: '2020-01-17', type:'task', duration: 3, progress: 0.6, parent: 1},
					// {id: 3, type: 'milestone', text: 'Milestone', start_date: '2020-01-20', progress: 0, parent: 1},
					// {id: 4, text: 'Task #2', start_date: '2020-01-20', duration: 3, progress: 0.4, parent: 1},
					// {id:23, text:'Mediate milestone', start_date:'2020-01-23', type:gantt.config.types.milestone, parent:1, progress: 0, open: true}
				],
				links: [
					// {id: 2, source: 2, target: 3, type: '0'},
					// {id: 3, source: 3, target: 4, type: '0'}
				],
			},

            loadingController: false,
        };
    },
    computed: {
        autoHeight: function() {
            return (window.top === window) ? (window.innerHeight - 140) : (window.innerHeight - 80);
        }
    },
    methods: {
        queryData() {
            this.loadingController = true;

            this.$get('/gantt/list', {
                procode: this.$route.params.procode,
            }, data => {
                this.loadingController = false;

                this.tableData = data;
            });
        },
        saveHandler(data) {
            this.$post('/gantt/save', {
                ...data,
                procode: this.$route.params.procode,
            }, () => {
                showMsg('保存成功');
            }, true);
        },
    },
    mounted() {
        this.queryData();
    },
};
</script>