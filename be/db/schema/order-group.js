const mongoose = require('../index.js');

var Schema = mongoose.Schema;

let data = {
    userid: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    linkid: String,
    type: String, // task-group:project-task, task:project-group, task:all-state, task:project-state

    order: Number,
    groupcode: String,
};

var dataSchema = Schema(data);

dataSchema.statics.updateOrder = async function(userid, type, targetArr = []) {
    // 把本人项目的都删除
    await this.deleteMany({
        userid,
        linkid: targetArr.map(item => item._id),
        type,
    });

    // 重新插入
    var insertArr = targetArr.map(item => {
        return {
            userid,
            linkid: item._id,
            type,
            order: item.order,
            groupcode: item.groupcode,
        };
    });

    var data = await this.insertMany(insertArr);

    return data;
};

dataSchema.statics.bindOrder = async function (userid, type, targetArr) {
    // 获取项目排序列表
    var orderList = await this.find({
        type,
        userid,
        linkid: targetArr.map(item => item.id),
    });

    // 按排序重新排列
    for (let i = 0; i < targetArr.length; i ++) {
        let row = targetArr[i];

        var target = await orderList.find(item => {
            return item.linkid === row.id;
        });

        if (!target) {
            continue;
        }

        row.order = target.order;
        row.groupcode = target.groupcode;
    }

    targetArr.sort((a, b) => {
        let o1 = a.order || 0,
            o2 = b.order || 0;

        return o1 - o2;
    });

    return targetArr;
};

var Data = mongoose.model('order-group', dataSchema);

module.exports = Data;
