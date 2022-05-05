const mongoose = require('../index.js');
const Chain = require('../../utils/Chain');

const resFrame = require('../../utils/resFrame');

var Schema = mongoose.Schema;

let data = {
    title: String,
    order: Number,

    adduser: String,
    addtime: String,

    procode: {
        type: Schema.Types.ObjectId,
        ref: 'project'
    },
    task: [
        {
            type: Schema.Types.ObjectId,
            ref: 'task'
        }
    ],
    
    scbj: Number,
};

var dataSchema = Schema(data);

// 移除task中的索引
dataSchema.statics.removeTaskId = function(groupcode, taskcode, cb) {
    var groupData;

    new Chain().link(next => {
        this.findById(groupcode, (err, data) => {
            if (err) {
                cb && cb(err);
                return;
            }
    
            var index = data.task.findIndex(item => {
                return item.toString() === taskcode;
            });
    
            data.task.splice(index, 1);

            groupData = data;
    
            next();
        });
    }).link(next => {
        this.findByIdAndUpdate(groupcode, groupData, err => {
            if (err) {
                cb && cb(err);
                return;
            }

            cb && cb(null);
        });
    }).run();
};

// 增加task中的索引
dataSchema.statics.addTaskId = function(groupcode, taskcode, cb) {
    var groupData;

    new Chain().link(next => {
        this.findById(groupcode, (err, data) => {
            if (err) {
                cb && cb(err);
                return;
            }
    
            data.task.push(mongoose.Types.ObjectId(taskcode));

            groupData = data;
    
            next();
        });
    }).link(next => {
        this.findByIdAndUpdate(groupcode, groupData, err => {
            if (err) {
                cb && cb(err);
                return false;
            }

            cb && cb();
        });
    }).run();
};

// 更新顺序
dataSchema.statics.updateOrder = function(arr, cb) {
    var bwArr = arr.map(item => {
        return {
            updateOne: {
                filter: {
                    _id: item._id,
                },
                update: {
                    order: item.order,
                },
            },
        };
    });

    this.bulkWrite(bwArr, (err, data) => {
        if (err) {
            cb && cb(err);
            return;
        }

        cb && cb(null, data);
    });
};

var Data = mongoose.model('task-group', dataSchema);

module.exports = Data;
