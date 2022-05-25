const mongoose = require('../index.js');

var Schema = mongoose.Schema;

let data = {
    proname: String,
    detail: String,
    adduser: String,
    addtime: String,
    scbj: Number,
    covercolor: String,
    member: [
        {
            type: Schema.Types.ObjectId,
            ref: 'project-member'
        }
    ],
    order: Number,
    groupcode: Number,
};

var dataSchema = Schema(data);

dataSchema.statics.getUsersPro = function(userid, all = false, cb) {
    var search = {
        adduser: userid,
    };

    if (!all) {
        // 获取的，不包括已删除的
        search.scbj = {
            $ne: 1
        };
    }

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
