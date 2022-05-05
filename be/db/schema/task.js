const mongoose = require('../index.js');

const resFrame = require('../../utils/resFrame');

var Schema = mongoose.Schema;

let data = {
    title: String,
    detail: String,
    starttime: String,
    endtime: String,
    duration: Number,
    level: String,
    state: String,
    order: Number,

    procode: {
        type: Schema.Types.ObjectId,
        ref: 'project'
    },
    groupcode: {
        type: Schema.Types.ObjectId,
        ref: 'task-group'
    },
    member: [
        {
            type: Schema.Types.ObjectId,
            ref: 'project-member'
        }
    ],

    adduser: String,
    addtime: String,
    scbj: Number,
};

var dataSchema = Schema(data);

dataSchema.statics.delRows = function(rows, cb) {
    this.updateMany({
        _id: {
            $in: rows.map(item => item._id),
        },
    }, {
        scbj: 1,
    }, (err, data) => {
        if (err) {
            tdata = resFrame('error', '', err);
            res.send(tdata);
            return false;
        }

        cb && cb(err, data);
    });
};

// 更新顺序及分组
dataSchema.statics.updateDrag = function(groupArr, cb) {
    var bwArr = groupArr.reduce((ba, group) => {
        ba = [
            ...ba,
            ...group.task.map(item => {
                return {
                    updateOne: {
                        filter: {
                            _id: item._id,
                        },
                        update: {
                            order: item.order,
                            groupcode: item.groupcode,
                        },
                    },
                };
            }),
        ]

        return ba;
    }, []);

    this.bulkWrite(bwArr, (err, data) => {
        if (err) {
            cb && cb(err);
            return;
        }

        cb && cb(null, data);
    });
};

var Data = mongoose.model('task', dataSchema);

module.exports = Data;
