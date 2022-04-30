const mongoose = require('../index.js');

var Schema = mongoose.Schema;

let data = {
    proname: String,
    detail: String,
    adduser: String,
    addtime: String,
    scbj: Number,
    member: [
        {
            type: Schema.Types.ObjectId,
            ref: 'project-member'
        }
    ]
};

var dataSchema = Schema(data);
var Data = mongoose.model('project', dataSchema);

module.exports = Data;
