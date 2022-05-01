const mongoose = require('../index.js');

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
var Data = mongoose.model('task-group', dataSchema);

module.exports = Data;
