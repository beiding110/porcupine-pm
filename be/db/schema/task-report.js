const mongoose = require('../index.js');
const Chain = require('../../utils/Chain');

const resFrame = require('../../utils/resFrame');

var Schema = mongoose.Schema;

let data = {
    reporttime: String,
    tasktime: Number,
    member: {
        type: Schema.Types.ObjectId,
        ref: 'project-member'
    },
    detail: String,

    adduser: String,
    addtime: String,

    procode: {
        type: Schema.Types.ObjectId,
        ref: 'project'
    },
    taskcode: {
        type: Schema.Types.ObjectId,
        ref: 'task'
    },
    
    scbj: Number,
};

var dataSchema = Schema(data);

var Data = mongoose.model('task-report', dataSchema);

module.exports = Data;
