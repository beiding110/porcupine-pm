export default function(data, mapKey) {
    var mapObj = {};

    mapObj = data.reduce((obj, item) => {
        var point;

        if (typeof mapKey === 'function') {
            point = mapKey(item)
        } else {
            point = item[mapKey];
        }

        var itemInObj = obj[point];

        if (itemInObj) {
            obj[point].reportTimes += 1;
            obj[point].tasktime += item.tasktime;
        } else {
            obj[point] = {
                reportTimes: 1,
                tasktime: item.tasktime,
            };
        }

        return obj;
    }, {})

    return mapObj;
}