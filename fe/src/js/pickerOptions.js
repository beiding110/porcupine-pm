var oneDat = 3600 * 1000 * 24;

var firstOfYear = new Date(),
    lastDayOfYear = new Date();

    firstOfYear.setMonth(0);
    firstOfYear.setDate(1);

    lastDayOfYear.setMonth(11);
    lastDayOfYear.setDate(31);

    firstOfYear = firstOfYear.pattern('yyyy-MM-dd');
    lastDayOfYear = lastDayOfYear.pattern('yyyy-MM-dd');
    
export default {
    shortcuts: [
        {
            text: '近一周',
            onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - (oneDat * 7));
                picker.$emit('pick', [start, end]);
            }
        }, {
            text: '近一个月',
            onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - (oneDat * 30));
                picker.$emit('pick', [start, end]);
            }
        }, {
            text: '近三个月',
            onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - (oneDat * 90));
                picker.$emit('pick', [start, end]);
            }
        }, {
            text: '近一年',
            onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - (oneDat * 365));
                picker.$emit('pick', [start, end]);
            }
        }, {
            text: '今年',
            onClick(picker) {
                picker.$emit('pick', [firstOfYear, lastDayOfYear]);
            }
        },
    ],
}