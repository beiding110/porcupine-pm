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
    ],
};

var dataSchema = Schema(data);

dataSchema.statics.getUsersPro = function(userid, cb) {
    var search = {
        scbj: {
            $ne: 1,
        },
        adduser: userid,
    };

    this.find(search, (err, data) => {
        if (err) {
            cb(err);
            return false;
        }

        cb(null, data);
    });
};

var Data = mongoose.model('project', dataSchema);

module.exports = Data;
