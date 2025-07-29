const mongoose = require('../index.js');
const Chain = require('../../utils/Chain');

var Schema = mongoose.Schema;

let data = {
    title: String,
    detail: String,
    starttime: String,
    endtime: String,
    duration: Number,
    level: {
        type: String,
        enum: [
            '',
            'l', // 低
            'm', // 中
            'h', // 高
        ],
    },
    state: {
        type: String,
        enum: [
            '1', // 待办
            '2', // 未开始
            '3', // 进行中
            '4', // 已完成
        ],
    },
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

    filetime: String,
};

var dataSchema = Schema(data);

dataSchema.statics.getRow = async function(taskcode) {
    var taskWithMemberData = await this.findById(taskcode).populate('member');

    return taskWithMemberData;
}

dataSchema.statics.getList = async function(search, sort = {}) {
    var search = {
        scbj: {
            $ne: 1,
        },
        ...search,
    };

    var data = await this.find(search, null, {
        sort,
    }).populate([
        {
            path: 'member',
        },
        {
            path: 'procode',
        },
    ]);

    return data;
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

// 更新状态
dataSchema.statics.updateState = async function(tasks) {
    var bwArr = tasks.map(task => {
        return {
            updateOne: {
                filter: {
                    _id: task._id,
                },
                update: {
                    state: task.state,
                },
            },
        }
    });

    await this.bulkWrite(bwArr);
};

var Data = mongoose.model('task', dataSchema);

module.exports = Data;
