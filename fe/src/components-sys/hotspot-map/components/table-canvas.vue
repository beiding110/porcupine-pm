<template>
    <canvas 
        class="table-canvas"
        ref="canvas"
        :width="calcWidth"
        :height="calcHeight"
    ></canvas>
</template>

<script>
export default {
    props: {
        date: {
            type: Array,
            default: () => [],
        },
        data: {
            type: Array,
            default: () => [],
        },
    },
    data() {
        return {
            cellSize: 20,
        };
    },
    watch: {
        date: {
            handler() {
                this.$nextTick(() => {
                    this.init();
                });
            },
            deep: true,
        },
        data: {
            handler() {
                this.$nextTick(() => {
                    this.init();
                });
            },
            deep: true,
        },
    },
    computed: {
        calcWidth() {
            return (this.date.length * this.cellSize);
        },
        calcHeight() {
            var rows = this.data.reduce((sum, item) => {
                return (sum + item.member.length)
            }, 0);

            // 顶部年月日
            rows += 3;

            return (rows * this.cellSize);
        },
    },
    methods: {
        init() {
            var canvas = this.$refs.canvas,
                ctx = canvas.getContext('2d');

            this.clear(ctx);

            this.drawHead(ctx);

            this.drawBody(ctx);
        },
        drawHead(ctx) {
            var headArr = ['y', 'm', 'd'];

            headArr.forEach((row, rowIndex) => {
                this.date.forEach((item, index) => {
                    var x = index * this.cellSize,
                        y = rowIndex * this.cellSize,
                        theme,
                        haflCell = this.cellSize / 2;

                    if (row === 'y' && item.ycolindex === 0) {
                        let width = item.ycolnum * this.cellSize;

                        this.drawCell(ctx, x, y, {
                            width,
                        });

                        this.fillText(ctx, item[row], x + (width / 2), y + haflCell);

                        return;
                    }

                    if (row === 'm' && item.mcolindex === 0) {
                        let width = item.mcolnum * this.cellSize;

                        this.drawCell(ctx, x, y, {
                            width,
                        });

                        this.fillText(ctx, item[row], x + (width / 2), y + haflCell);

                        return;
                    }

                    if (row === 'd') {
                        if (~[0, 6].indexOf(item.day)) {
                            // 周末
                            theme = {
                                border: '#EBEDF0',
                                background: '#EBEDF0',
                            };
                        }

                        if (item.today) {
                            theme = {
                                border: '#E6A23C',
                                background: '#E6A23C',
                            }
                        }

                        this.drawCell(ctx, x, y, theme);
                        this.fillText(ctx, item[row], x + haflCell, y + haflCell);
                    }
                });
            });
        },
        drawBody(ctx) {
            // 绘制标体
            var row = 3;

            this.data.forEach((proItem, proIndex) => {
                proItem.member.forEach((memberItem, memberIndex) => {
                    this.date.forEach((dateItem, index) => {
                        let theme = this.checkCellType(memberItem, dateItem);

                        this.drawCell(ctx, index * this.cellSize, row * this.cellSize, theme);
                    });

                    row ++;
                });
            });
        },
        drawCell(ctx, left, top, setting = {}) {
            var defaultSetting = {
                background: 'white', 
                border: '#DCDFE6',
                width: this.cellSize,
                height: this.cellSize,
            }

            setting = {
                ...defaultSetting,
                ...setting,
            };

            ctx.fillStyle = setting.background;
            ctx.strokeStyle = setting.border;
            ctx.lineWidth = 1;

            ctx.fillRect(left, top, setting.width, setting.height);
            ctx.strokeRect(left, top, setting.width, setting.height);
        },
        fillText(ctx, text, left, top, theme = {color: '#303133'}) {

            ctx.fillStyle = theme.color;
            ctx.textBaseline = 'middle';
            ctx.textAlign = 'center';
            ctx.fillText(text, left, top);
        },
        checkCellType(memberItem, dateItem) {
            var {date} = dateItem,
                {report} = memberItem,
                reportIndex;

            if (!report) {
                return {
                    background: 'white',
                    border: '#DCDFE6',
                };
            }

            if (!report.some((item, index) => {
                if(item.reporttime === date) {
                    reportIndex = index;

                    return true;
                }

                return false;
            })) {
                return {
                    background: 'white',
                    border: '#DCDFE6',
                };
            }

            var {reporttime, reporttimes} = report[reportIndex],
                normalColor = '#40C463',
                middleColor = '#30A14E',
                highColor = '#216E39';

            if (reporttimes <= 1) {
                return {
                    background: normalColor,
                    border: normalColor,
                };
            } else if (reporttimes <= 2) {
                return {
                    background: middleColor,
                    border: middleColor,
                };
            } else {
                return {
                    background: highColor,
                    border: highColor,
                };
            }
        },
        clear(ctx) {
            ctx.clearRect(0, 0, this.calcWidth, this.calcHeight);
        },
    },
    mounted() {
        this.init();
    },
};
</script>

<style lang="scss" scoped>
    .table-canvas{
        display: block;
    }
</style>