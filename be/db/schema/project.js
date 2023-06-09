const {Types} = require('mongoose');

const mongoose = require('../index.js');

const User = require('./user.js');
const ProjectMember = require('./project-member');

var Schema = mongoose.Schema;

let data = {
    proname: String,
    detail: String,
    groupid: String,
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
    groupcode: String,
};

var dataSchema = Schema(data);

dataSchema.statics.getUsersPro = async function(userid, all = false, cb) {
    var groupid = await User.getGroupId(userid), // 当前用户的组织id
        level = await User.getLevel(userid); // 当前用户的权限等级

    var search = {};

    if (!all) {
        // 获取的，不包括已删除的
        search.scbj = {
            $ne: 1
        };
    }

    if (level === 'A') {
        // 管理员权限，读取全部项目
        search.groupid = groupid;
    } else if (level === 'M') {
        // 项目经理权限，读取自己创建的或参与的

        // 当前用户的projectMemberId
        let proMemberItem = await ProjectMember.findOne({
            userid: Types.ObjectId(userid),
            groupid,
        });

        search['$or'] = [
            {
                adduser: userid,
            },
            {
                'member': proMemberItem._id,
            }
        ];
    } else {
        // 无权限，读取自己参与的

        // 当前用户的projectMemberId
        let proMemberItem = await ProjectMember.findOne({
            userid: Types.ObjectId(userid),
            groupid,
        });

        search.member = proMemberItem.id;
    }

    var res = this.find(search);

    return res;
};

var Data = mongoose.model('project', dataSchema);

module.exports = Data;
