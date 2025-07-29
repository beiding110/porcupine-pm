const mongoose = require('../index.js');

var Schema = mongoose.Schema;

let data = {
    id: {
        type: String,
        default: '',
    },
    text: {
        type: String,
        default: '',
    },
    duration: {
        type: Number,
        default: 0,
    },
    start_date: {
        type: String,
        default: '',
    },
    end_date: {
        type: String,
        default: '',
    },
    progress: {
        type: Number,
        default: 0,
    },
    parent: {
        type: String,
        default: '',
    },

    type: {
        type: String,
        default: 'task',
        enum: [
            'task', // 任务
            'project', // 项目
            'milestone', // 里程碑
        ],
    },
    
    procode: {
        type: Schema.Types.ObjectId,
        ref: 'project'
    },
    taskcode: {
        type: Schema.Types.ObjectId,
        ref: 'task'
    },

    adduser: String,
    addtime: String,

    scbj: Number,
};

var dataSchema = Schema(data);
var Data = mongoose.model('gantt-data', dataSchema);

module.exports = Data;
