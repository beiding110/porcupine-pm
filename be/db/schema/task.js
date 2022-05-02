const mongoose = require('../index.js');

var Schema = mongoose.Schema;

let data = {
    title: String,
    detail: String,
    starttime: String,
    endtime: String,
    duration: Number,
    level: String,
    state: String,

    procode: String,
    groupcode: String,

    adduser: String,
    addtime: String,
    scbj: Number,
    member: [
        {
            type: Schema.Types.ObjectId,
            ref: 'task'
        }
    ]
};

var dataSchema = Schema(data);
var Data = mongoose.model('task', dataSchema);

module.exports = Data;
