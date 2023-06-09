const mongoose = require('../index.js');

const User = require('./user.js');

var Schema = mongoose.Schema;

let data = {
    name: String,
    groupid: String,
    
    userid: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },

    adduser: String,
    addtime: String,

    scbj: Number,
};

var dataSchema = Schema(data);

dataSchema.statics.getUserInProMember = async function (userid) {
    const groupid = await User.getGroupId(userid);

    var data = await this.findOne({
        groupid,
        userid,
    });

    return data || {};
};

var Data = mongoose.model('project-member', dataSchema);

module.exports = Data;
