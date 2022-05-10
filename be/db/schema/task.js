const mongoose = require('../index.js');
const Chain = require('../../utils/Chain');

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

dataSchema.statics.getRow = function(taskcode, cb) {
    var taskData,
        taskWithMemberData;

    new Chain().link(next => {
        this.findById(taskcode, (err, data) => {
            if (err) {
                cb && cb(err);
                return;
            }

            taskData = data;
    
            next();
        });
    }).link(next => {
        this.populate(taskData, 'member', (err, data) => {
            if (err) {
                cb && cb(err);
                return;
            }

            taskWithMemberData = data;

            next();
        });
    }).link(next => {
        cb && cb(null, taskWithMemberData);
    }).run();
}

dataSchema.statics.getList = function(search, cb) {
    var search = {
        scbj: {
            $ne: 1,
        },
        ...search,
    };

    new Chain().link(next => {
        this.find(search, (err, data) => {
            if (err) {
                cb(err);
                return false;
            }

            taskData = data;
    
            next()
        });
    }).link(next => {
        this.populate(taskData, [
            {
                path: 'member',
            },
            {
                path: 'procode',
            },
        ], (err, data) => {
            if (err) {
                cb(err);
            }

            taskWithMemberData = data;

            next();
        });
    }).link(next => {
        cb(null, taskWithMemberData);
    }).run();
};

dataSchema.statics.delRows = function(rows, cb) {
    this.updateMany({
        _id: {
            $in: rows.map(item => item._id),
        },
    }, {
        scbj: 1,
    }, (err, data) => {
        if (err) {
            cb(err);

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
                            state: item.state,
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
