const mongoose = require('../index.js');
const Chain = require('../../utils/Chain');

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

// 更新顺序
dataSchema.statics.updateTaskId = async function(arr) {
    var bwArr = arr.map(item => {
        return {
            updateOne: {
                filter: {
                    _id: item._id,
                },
                update: {
                    task: item.task.map(item => item._id),
                },
            },
        };
    });

    var data = await this.bulkWrite(bwArr);

    return data;
};

// 批量更新group中的task关联关系
dataSchema.statics.updateTask = function(taskArrWithGroupCode, cb) { 
    // [{groupcode, _id}] = taskArrWithGroupCode;

    var groupData;
    
    new Chain().link(next => {
        this.find({
            _id: {
                $in: taskArrWithGroupCode.map(item => item.groupcode),
            }
        }, (err, data) => {
            if (err) {
                cb(err);
                return false;
            }

            groupData = data;
    
            next()
        });
    }).link(next => {
        taskArrWithGroupCode.forEach(taskItem => {
            let taskId = taskItem._id;

            groupData.forEach(group => {
                let {task, id} = group;

                if (id === taskItem.groupcode) {
                    var existIndex;

                    if (existIndex = task.indexOf(taskId), ~existIndex) {
                        task.splice(existIndex, 1);
                    } else {
                        task.push(existIndex);
                    }
                }
            });
        });

        next();
    }).link(next => {

        var bulkWriteSearch = groupData.map(item => {
            return {
                updateOne: {
                    filter: {
                        _id: item.id,
                    },
                    update: {
                        task: item.task,
                    },
                },
            };
        });

        this.bulkWrite(bulkWriteSearch, (err, data) => {
            if (err) {
                cb(err);
                return false;
            }
    
            cb(null, data);
        });
    }).run();
};

var Data = mongoose.model('task-group', dataSchema);

module.exports = Data;
