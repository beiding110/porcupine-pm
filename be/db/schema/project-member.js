const mongoose = require('../index.js');

var Schema = mongoose.Schema;

let data = {
    name: String,
    
    procode: {
        type: Schema.Types.ObjectId,
        ref: 'project'
    },

    adduser: String,
    addtime: String,

    scbj: Number,
};

var dataSchema = Schema(data);
var Data = mongoose.model('project-member', dataSchema);

module.exports = Data;
