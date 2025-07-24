const oneDat = 3600 * 1000 * 24;

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
            text: '今天',
            onClick(picker) {
                const start = new Date();

                picker.$emit('pick', [start, start]);
            },
        },
        {
            text: '前1天',
            onClick(picker) {
                const start = new Date();

                start.setTime(start.getTime() - oneDat * 1);

                picker.$emit('pick', [start, start]);
            },
        },
        {
            text: '近7天',
            onClick(picker) {
                const end = new Date();
                const start = new Date();

                start.setTime(start.getTime() - oneDat * 7);
                picker.$emit('pick', [start, end]);
            },
        },
        {
            text: '近30天',
            onClick(picker) {
                const end = new Date();
                const start = new Date();

                start.setTime(start.getTime() - oneDat * 30);
                picker.$emit('pick', [start, end]);
            },
        },
        {
            text: '近60天',
            onClick(picker) {
                const end = new Date();
                const start = new Date();

                start.setTime(start.getTime() - oneDat * 60);
                picker.$emit('pick', [start, end]);
            },
        },
        {
            text: '近90天',
            onClick(picker) {
                const end = new Date();
                const start = new Date();

                start.setTime(start.getTime() - oneDat * 90);
                picker.$emit('pick', [start, end]);
            },
        },
        {
            text: '近180天',
            onClick(picker) {
                const end = new Date();
                const start = new Date();

                start.setTime(start.getTime() - oneDat * 180);
                picker.$emit('pick', [start, end]);
            },
        },
        {
            text: '近365天',
            onClick(picker) {
                const end = new Date();
                const start = new Date();

                start.setTime(start.getTime() - oneDat * 365);
                picker.$emit('pick', [start, end]);
            },
        },
        {
            text: '今年',
            onClick(picker) {
                picker.$emit('pick', [firstOfYear, lastDayOfYear]);
            },
        },
    ],
};
