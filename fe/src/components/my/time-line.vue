<template>
    <div
        ref="_visualization"
        style="position: relative"
        class="my__timeline"
        v-loading="loadingController"
        element-loading-background="rgba(0, 0, 0, 0)"
    ></div>
</template>

<script>
import moment from 'moment';
import { DataSet } from 'vis-data/peer';
import { Timeline } from 'vis-timeline/peer';
import 'vis-timeline/styles/vis-timeline-graph2d.css';

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
        options: {
            type: Object,
            default: () => ({}),
        },
    },
    data() {
        return {
            timeline: null,

            loadingController: false,
        };
    },
    watch: {
        data: {
            handler: function () {
                this.init();
            },
        },
    },
    methods: {
        init: function () {
            this.loadingController = true;

            try {
                this.timeline.destroy();
            } catch (e) {
                // e
            }

            // DOM element where the Timeline will be attached
            if (this.data && this.data.length === 0) {
                this.loadingController = false;

                return;
            }

            // Create a DataSet (allows two way data-binding)
            var items = new DataSet(this.data),
                groups;

            if (this.groups) {
                groups = new DataSet(this.groups);
            }

            // Configuration for the Timeline
            const options = {
                locale: moment.locale('zh-cn'),
                margin: {
                    item: 6,
                },
                xss: {
                    disabled: true,
                },
                zoomMin: 1000 * 60 * 60 * 24 * 7,
                zoomMax: 1000 * 60 * 60 * 24 * 365 * 5,
                onInitialDrawComplete: () => {
                    this.loadingController = false;
                },
                visibleFrameTemplate: (item) => {
                    if (item.visibleFrameTemplate) {
                        return item.visibleFrameTemplate;
                    }

                    if (item.value) {
                        let percentage = (Number(item.value) * 100).toFixed(0) + '%',
                            progressClass = item.progressClass || '';

                        return `
                            <div class="progress-wrapper">
                                <div class="progress ${progressClass}" style="width: ${percentage}">
                                    <label class="progress-label">${percentage}</label>
                                </div>
                            </div>
                        `;
                    }

                    return '';
                },
                ...this.options,
            };

            // Create a Timeline
            this.timeline = new Timeline(this.$refs._visualization, items, groups, options);

            this.timeline.on('click', e => {
                this.$emit('click', e);
            });

            this.timeline.on('contextmenu', e => {
                e.event.preventDefault();
                e.event.stopPropagation();

                this.$emit('contextmenu', e);
            });
        },
        updateData() {},
    },
    mounted() {
        this.init();
    },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import '@css/var.scss';

.my__timeline {
    padding: 1em;

    ::v-deep {
        .progress-wrapper {
            width: 100%;
            height: 18px;
            text-align: center;
            position: relative;
            overflow: hidden;

            .progress {
                height: 100%;
                width: 60%;
                position: absolute;
                left: 0px;
                top: 0px;
                background: $successColor;
                border-radius: 2px;

                &.info {
                    background: $infoColor;
                }
                &.error {
                    background: $dangerColor;
                }
                &.warning {
                    background: $warningColor;
                }

                .progress-label {
                    position: absolute;
                    z-index: 1;
                    color: white;
                }
            }
        }

        .vis-timeline {
            border: none;

            .vis-current-time {
                background-color: red;
                z-index: 2;
            }

            .vis-item {
                background-color: $primaryColor1;
                border: 1px solid $primaryColor;

                .vis-item-overflow {
                    background-color: $primaryColor;
                    border-radius: 2px;

                    .vis-item-content {
                        color: white;
                    }
                }

                &.info {
                    background: $infoColor1;
                    border: 1px solid $infoColor;

                    .vis-item-overflow {
                        background: $infoColor;
                    }
                }
                &.success {
                    background: $successColor1;
                    border: 1px solid $successColor;

                    .vis-item-overflow {
                        background: $successColor;
                    }
                }
                &.error {
                    background: $dangerColor1;
                    border: 1px solid $dangerColor;

                    .vis-item-overflow {
                        background: $dangerColor;
                    }
                }
                &.warning {
                    background: $warningColor1;
                    border: 1px solid $warningColor;

                    .vis-item-overflow {
                        background: $warningColor;
                    }
                }

                &.vis-selected {
                    border: 1px solid $warningColor;
                }
            }
        }
    }
}
</style>
