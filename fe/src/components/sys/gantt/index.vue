<template>
    <div class="container-gantt" v-loading.sync="loadingController">
        <div class="toolbar" v-if="!readonly">
            <el-dropdown @command="handleCommand" trigger="click">
                <el-button size="mini">文件</el-button>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="save" icon="el-icon-folder">保存</el-dropdown-item>
                    <el-dropdown-item command="importExcel" v-if="excel">导入Excel</el-dropdown-item>
                    <el-dropdown-item command="importMsPro">导入MsProject</el-dropdown-item>
                    <el-dropdown-item command="exportToExcel">导出为Excel</el-dropdown-item>
                    <el-dropdown-item command="exportToMsPro">导出为MsProject</el-dropdown-item>
                    <el-dropdown-item command="exportToPDF">导出为PDF</el-dropdown-item>
                    <el-dropdown-item command="exportToPNG">导出为PNG</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
            <el-dropdown @command="handleCommand" trigger="click">
                <el-button size="mini">编辑</el-button>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="revoke" icon="el-icon-caret-left">撤销</el-dropdown-item>
                    <el-dropdown-item command="redo" icon="el-icon-caret-right">重做</el-dropdown-item>
                    <el-dropdown-item command="clear" icon="el-icon-delete-solid">全部清空</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
            <!-- <el-dropdown @command="handleCommand" trigger="click">
                <el-button size="mini">模板</el-button>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="demoExcel" icon="el-icon-download" v-if="excel">Excel模板</el-dropdown-item>
                    <el-dropdown-item command="demoMsPro" icon="el-icon-download">MsProject模板</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown> -->
            <el-button size="mini" @click="handleCommand('fullscreen')" icon="el-icon-full-screen">全屏</el-button>
            <el-button size="mini" @click="handleCommand('zoomIn')" icon="el-icon-zoom-in">放大</el-button>
            <el-button size="mini" @click="handleCommand('zoomOut')" icon="el-icon-zoom-out">缩小</el-button>
            <slot name="toolbar"></slot>
        </div>

        <div ref="gantt" :style="{height:innerHeight}" class="gantt"></div>

        <my-dialog v-model="dialogVisible" title="上传文件" width="400px">
            <el-upload
            ref="upload"
            drag
            action=""
            :data="importExtra"
            :accept="fileAccept"
            :on-change="fileChange"
            :show-file-list="false"
            :auto-upload="false"
            >
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                <div class="el-upload__tip" slot="tip">只能上传{{fileAccept}}文件</div>
            </el-upload>
        </my-dialog>
    </div>
</template>

<script>
import { gantt } from 'dhtmlx-gantt';
import 'dhtmlx-gantt/codebase/dhtmlxgantt.css';

import './js/api.js'

gantt.plugins({ 
    tooltip: true,
    fullscreen: true,
    undo: true,
}); 

gantt.i18n.setLocale('cn');

export default {
    props: {
        data: {
            type: Object,
            default: function() {
                return {
                    data: [],
                    links: []
                }
            }
        },
        height: {
            type: [String, Number],
            default: 'auto'
        },
        readonly: {
            type: Boolean,
            default: false
        },
        scaleHeight: {
            type: Number,
            default: 40
        },
        importExtra: {
            type: Object,
            default: function() {
                return {};
            }
        },
        demoUrl: {
            type: String,
            default: '/static/'
        },
        excel: {
            type: Boolean,
            default: false
        },
        useApi: {
            type: Boolean,
            default: false
        }
    },
    data: function() {
        return {
            dialogVisible: false,
            fileAccept: '',
            loadingController: false
        }
    },
    computed: {
        innerHeight: function() {
            if(getType(this.height) === 'number') {
                return (this.height + 'px');
            } else {
                if(/px/.test(this.height)) return this.height;
                else return (this.height + 'px');
            }
        }
    },
    watch: {
        data: {
            handler: function(n, o) {
                if (n === o) {
                    return;
                }

                this.parse();
            }, deep: true
        }
    },
    methods: {
        handleCommand: function(command) {
            var switchObj = {
                save: function() {
                    this.$emit('save', this.getData())
                },
                importExcel: function() {
                    if(!!this.data.data && this.data.data.length > 0) {
                        showConfirm('重新导入数据将导致<span style="color:red">当前进度数据，及已与其关联的数据全部失效，且不可撤销</span>。是否重新导入？', 'warning', function() {
                            this.fileAccept = '.xlsx';
                            this.dialogVisible = true;
                        }.bind(this));
                    } else {
                        this.fileAccept = '.xlsx';
                        this.dialogVisible = true;
                    }
                },
                importMsPro: function() {
                    if(!!this.data.data && this.data.data.length > 0) {
                        showConfirm('重新导入数据将导致<span style="color:red">当前进度数据，及已与其关联的数据全部失效，且不可撤销</span>。是否重新导入？', 'warning', function() {
                            this.fileAccept = '.mpp';
                            this.dialogVisible = true;
                        }.bind(this));
                    } else {
                        this.fileAccept = '.mpp';
                        this.dialogVisible = true;
                    }
                },
                exportToExcel: function() {
                    gantt.exportToExcel();
                },
                exportToMsPro: function() {
                    gantt.exportToMSProject();
                },
                exportToPDF: function() {
                    gantt.exportToPDF();
                },
                exportToPNG: function() {
                    gantt.exportToPNG();
                },

                revoke: function() {
                    gantt.undo();
                },
                redo: function() {
                    gantt.redo();
                },
                clear: function() {
                    showConfirm('全部清空将会导致已与现有进度计划关联的数据失效，且不可撤销。确认全部清空吗', 'warning', function() {
                        gantt.clearAll();
                    });
                },

                fullscreen: function() {
                    gantt.ext.fullscreen.toggle();
                },
                zoomIn: function() {
                    gantt.ext.zoom.zoomIn();
                },
                zoomOut: function() {
                    gantt.ext.zoom.zoomOut();
                },

                demoExcel: function() {
                    downloader(this.demoUrl + 'DemoProject.xlsx')
                },
                demoMsPro: function() {
                    downloader(this.demoUrl + 'DemoProject.mpp')
                },
            };

            switchObj[command] && switchObj[command].call(this);
        },
        fileChange: function(file, fileList) {
            this.loadingController = true;
            this.dialogVisible = false;

            gantt.importFromMSProject({
                data: file.raw,
                callback: project => {
                    if (project) {
                        gantt.clearAll();

                        if (project.config.duration_unit) {
                            gantt.config.duration_unit = project.config.duration_unit;
                        }

                        arrBuildTree(project.data.data, 'parent', 'id');

                        project.data.data.forEach(item => {
                            if (item.children) {
                                item.type = 'project';
                            }

                            if (item.duration === '0') {
                                item.type = 'milestone';
                            }
                        });

                        gantt.parse(project.data);
                    }

                    this.loadingController = false;
                }
            });
        },
        parse: function() {
            if(!this.data || JSON.stringify(this.data) === '{}') return;
            gantt.parse(this.data);
        },
        initTooltip: function() {
            gantt.templates.tooltip_text = function(start,end,task){
                return `<b>任务名:</b>${task.text}<br/>
                        <b>开始时间:</b>${task.start_date.pattern('yyyy-MM-dd')}<br/>
                        <b>结束时间:</b>${task.end_date.pattern('yyyy-MM-dd')}`;
            };
            gantt.attachEvent("onGanttReady", function(){
                var tooltips = gantt.ext.tooltips;

                tooltips.tooltip.setViewport(gantt.$task_data);
            });
        },
        resetLightBox: function() {
            var typeSelect = {
                label: "类型", height: 22, map_to: "type", type: "select", name: 'type',
                options: [
                    {key: 'project', label: "任务组"},
                    {key: 'task', label: "任务"},
                    {key: 'milestone', label: "里程碑"}
                ]
            };

            gantt.config.lightbox.sections.splice(1, 0, typeSelect);
            gantt.config.lightbox.project_sections.splice(1, 0, typeSelect);
            gantt.config.lightbox.milestone_sections.splice(1, 0, typeSelect);
        },
        getData: function() {
            var taskData = gantt.getDatastore('task').pull,
                linkData = gantt.getDatastore('link').pull;

            function obj2Arr(obj) {
                var arr = [];

                for(var index in obj) {
                    var arrItem = {};
                    Object.keys(obj[index]).forEach(function(key) {
                        var itemInDataSet = obj[index][key];
                        arrItem[key] = (getType(itemInDataSet) === 'date') ? itemInDataSet.pattern('yyyy-MM-dd HH:mm:ss') : itemInDataSet;
                    });

                    arrItem.type = arrItem.$rendered_type;

                    arr.push(arrItem);
                }

                return arr;
            }

            return {
                data: obj2Arr(taskData),
                links:  obj2Arr(linkData)
            }
        },
        initZoom: function() {
            var zoomConfig = {
                levels: [
                    {
                        name:"day",
                        scale_height: 27,
                        min_column_width:80,
                        scales:[
                            {unit: "day", step: 1, format: "%d %M"}
                        ],
                    }, {
                        name:"week",
                        scale_height: 50,
                        min_column_width:50,
                        scales:[
                            {unit: "week", step: 1, format: function (date) {
                                var dateToStr = gantt.date.date_to_str("%d %M");
                                var endDate = gantt.date.add(date, -6, "day");
                                var weekNum = gantt.date.date_to_str("%W")(date);
                                return "#" + weekNum + ", " + dateToStr(date) + " - " + dateToStr(endDate);
                            }},
                            {unit: "day", step: 1, format: "%j %D"}
                        ]
                    }, {
                        name:"month",
                        scale_height: 50,
                        min_column_width:120,
                        scales:[
                            {unit: "month", format: "%F, %Y"},
                            {unit: "week", format: "Week #%W"}
                        ]
                    }, {
                        name:"quarter",
                        height: 50,
                        min_column_width:90,
                        scales:[
                            {unit: "month", step: 1, format: "%M"},
                            {
                                unit: "quarter", step: 1, format: function (date) {
                                    var dateToStr = gantt.date.date_to_str("%M");
                                    var endDate = gantt.date.add(gantt.date.add(date, 3, "month"), -1, "day");
                                    return dateToStr(date) + " - " + dateToStr(endDate);
                                    }
                                }
                            ]
                    }, {
                        name:"year",
                        scale_height: 50,
                        min_column_width: 30,
                        scales:[
                            {unit: "year", step: 1, format: "%Y"}
                        ]
                    }
                ]
            };
            
            gantt.ext.zoom.init(zoomConfig);
        },
        initBeforeDel: function() {
            gantt.attachEvent("onLightboxDelete", function(id){
                var task = gantt.getTask(id);
                console.log(task)

                if (task.shbj === '1'){
                    showMsgBox('该项进度计划已关联其他数据，不可删除');
                    return false;
                }
                
                return true;
            })
        }
    },
    mounted: function () {
        gantt.config.xml_date = "%Y-%m-%d";
        gantt.config.readonly = this.readonly;
        gantt.config.scale_height = this.scaleHeight;

        gantt.templates.rightside_text = function (start, end, task) {
            if (task.type == gantt.config.types.milestone) {
                return task.text;
            }
            return "";
        };

        this.initZoom();
        this.initTooltip();
        this.resetLightBox();
        this.initBeforeDel();

        gantt.init(this.$refs.gantt);
        this.parse();
    },
    beforeDestroy() {
        gantt.clearAll();
    },
}
</script>

<style lang="scss" scoped>
    .container-gantt {
        .toolbar {
            margin-bottom: 5px;
            .el-button {
                border: none;
            }
        }

        .gantt {
            z-index: 999 !important;
        }
    }
</style>