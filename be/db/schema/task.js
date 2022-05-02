const mongoose = require('../index.js');

const resFrame = require('../../utils/resFrame');

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
            ref: 'project-member'
        }
    ]
};

var dataSchema = Schema(data);

dataSchema.statics.delRows = function(rows, cb) {
    this.updateMany({
        _id: {
            $in: rows.map(item => item._id),
        },
    }, {
        scbj: 1,
    }, (err, data) => {
        if (err) {
            tdata = resFrame('error', '', err);
            res.send(tdata);
            return false;
        }

        cb && cb(err, data);
    });
};

var Data = mongoose.model('task', dataSchema);

module.exports = Data;
