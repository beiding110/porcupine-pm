const mongoose = require('../index.js');
const Chain = require('../../utils/Chain');

const resFrame = require('../../utils/resFrame');

var Schema = mongoose.Schema;

let data = {
    title: String,
    procode: String,
    adduser: String,
    addtime: String,
    
    scbj: Number,
    task: [
        {
            type: Schema.Types.ObjectId,
            ref: 'task'
        }
    ],
};

var dataSchema = Schema(data);

// 移除task中的索引
dataSchema.statics.removeTaskId = function(groupcode, taskcode, cb) {
    var groupData;

    new Chain().link(next => {
        this.findById(groupcode, (err, data) => {
            if (err) {
                tdata = resFrame('error', '', err);
                res.send(tdata);
                return false;
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
                tdata = resFrame('error', '', err);
                res.send(tdata);
                return false;
            }

            cb && cb();
        });
    }).run();
};

// 增加task中的索引
dataSchema.statics.addTaskId = function(groupcode, taskcode, cb) {
    var groupData;

    new Chain().link(next => {
        this.findById(groupcode, (err, data) => {
            if (err) {
                tdata = resFrame('error', '', err);
                res.send(tdata);
                return false;
            }
    
            data.task.push(mongoose.Types.ObjectId(taskcode));

            groupData = data;
    
            next();
        });
    }).link(next => {
        this.findByIdAndUpdate(groupcode, groupData, err => {
            if (err) {
                tdata = resFrame('error', '', err);
                res.send(tdata);
                return false;
            }

            cb && cb();
        });
    }).run();
};

var Data = mongoose.model('task-group', dataSchema);

module.exports = Data;
