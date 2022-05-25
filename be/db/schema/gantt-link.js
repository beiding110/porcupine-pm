const mongoose = require('../index.js');

var Schema = mongoose.Schema;

let data = {
    source: {
        type: String,
        default: '',
    },
    target: {
        type: String,
        default: '',
    },
    type: {
        type: String,
        default: '0',
    },
    
    procode: {
        type: Schema.Types.ObjectId,
        ref: 'project'
    },

    adduser: String,
    addtime: String,

    scbj: Number,
};

var dataSchema = Schema(data);
var Data = mongoose.model('gantt-link', dataSchema);

module.exports = Data;
