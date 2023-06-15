<template>
    <div 
        ref="_visualization" 
        style="position:relative;" 
        class="my__timeline" 
        v-loading="loadingController" 
        element-loading-background="rgba(0, 0, 0, 0)"
    ></div>
</template>

<script>
const vis = require("vis-timeline/standalone");

export default {
    props: {
        data: {
            type: Array,
            default: () => [],
        },
        groups: {
            type: Array,
            default: () => [],
        },
    },
    data () {
        return {
            timeline: null,
            
            loadingController: false
        }
    },
    watch: {
        data: {
            handler: function (curVal, oldVal) {
                this.init();
            },
        },
    },
    methods: {
        init: function () {
            var that = this;

            this.loadingController = true;

            try {
                this.timeline.destroy();
            } catch (e) {}

            // DOM element where the Timeline will be attached
            if (!!this.data && this.data.length == 0) {
                this.loadingController = false;

                return;
            }

            // Create a DataSet (allows two way data-binding)
            var items = new vis.DataSet(this.data);

            if (this.groups) {
                var groups = new vis.DataSet(this.groups);
            }

            // Configuration for the Timeline
            var options = {
                zoomMin: 1000 * 60 * 60 * 24 * 7 * 2,
                // zoomMax: 1000 * 60 * 60 * 24 * 31 * 3,
                onInitialDrawComplete: function () {
                    that.loadingController = false;
                },
                // visibleFrameTemplate: function(item) {
                //     if (item.visibleFrameTemplate) {
                //         return item.visibleFrameTemplate;
                //     }

                //     if(!item.state){
                //         return ''
                //     }

                //     var percentage = (Number(item.value)*100).toFixed(0) + '%',
                //         extraClassName = '';

                //     var classSwitchObj = {
                //         '0': 'info',
                //         '1': 'warning',
                //         '2': 'primary',
                //     };

                //     extraClassName = classSwitchObj[item.state] || '';

                //     return `
                //         <div class="progress-wrapper">
                //             <div class="progress ${extraClassName}" style="width: ${percentage}">
                //                 <label class="progress-label">${percentage}</label>
                //             </div>
                //         </div>
                //     `;
                // }
            };

            // Create a Timeline
            this.timeline = new vis.Timeline(this.$refs._visualization, items, groups, options);
        },
        updateData() {
            
        }
    },
    mounted() {
        this.init();
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
    @import '@css/var.scss';

    .my__timeline{
        padding:1em;

        ::v-deep {
            .progress-wrapper {width:100%; height:18px; text-align:center; position:relative; overflow:hidden;}
            
            .progress {
                height:100%; width:60%; position:absolute; left:0px; top:0px; background:$successColor; border-radius: 2px;
                
                &.info{background:$infoColor;}
                &.error{background:$dangerColor;}
                &.warning{background:$warningColor;}

                .progress-label {position:absolute; z-index:1; color:white;}
            }
            
            .vis-timeline{border: none;}

            .vis-current-time{background-color: red; z-index:2;}

            .vis-item{
                background-color: $primaryColor1; 
                border: 1px solid $primaryColor;
                
                .vis-item-overflow{
                    background-color: $primaryColor; 
                    border-radius: 2px; 

                    .vis-item-content {
                        color: white;
                    }
                }

                &.vis-selected{border: 1px solid $warningColor;}
            }
        }
    }
</style>
