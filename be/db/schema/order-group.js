const mongoose = require('../index.js');

var Schema = mongoose.Schema;

let data = {
    userid: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    linkid: String,
    type: String,

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

    var data = this.insertMany(insertArr);

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
    targetArr.forEach((row) => {
        var target = orderList.find(item => {
            return item.linkid === row.id;
        });

        if (!target) {
            return;
        }

        row.order = target.order;
        row.groupcode = target.groupcode;
    });
    targetArr.sort((a, b) => {
        return a.order - b.order;
    });

    return targetArr;
};

var Data = mongoose.model('order-group', dataSchema);

module.exports = Data;
