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
        enum: [
            '0', // finish_to_start
            '1', // start_to_start
            '2', // finish_to_finish
            '3', // start_to_finish
        ],
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
