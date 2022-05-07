import dataToMap from './dataToMap';

export default function(data) {
    var mapObj = dataToMap(data, 'reporttime'),
        xData = [],
        sData_reportTimes = [],
        sData_tasktime = [];

    Object.keys(mapObj).forEach(key => {
        var item = mapObj[key];

        xData.unshift(key);
        sData_reportTimes.unshift(item.reportTimes);
        sData_tasktime.unshift(item.tasktime);
    });

    return {
        title: {
            text: '工时·天'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                animation: false,
                label: {
                    backgroundColor: '#505765'
                }
            }
        },
        xAxis: {
            type: 'category',
            data: xData,
        },
        yAxis: [
            {
                name: '上报次数',
                type: 'value'
            },
            {
                name: '工时合计',
                type: 'value'
            },
        ],
        series: [
            {
                data: sData_reportTimes,
                type: 'line'
            },
            {
                data: sData_tasktime,
                yAxisIndex: 1,
                type: 'line'
            },
        ]
    };
}