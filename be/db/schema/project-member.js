const mongoose = require('../index.js');

var Schema = mongoose.Schema;

let data = {
    name: String,
    procode: String,
    adduser: String,
    addtime: String,
    scbj: Number,
};

var dataSchema = Schema(data);
var Data = mongoose.model('project-member', dataSchema);

module.exports = Data;
