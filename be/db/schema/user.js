const mongoose = require('../index.js');
const app = require('../../utils/app');

const Authority = require('./authority.js');

var Schema = mongoose.Schema;

let data = {
    loginname: String,
    pwd: String,
    truename: String,
    addtime: String,
    groupid: String,
    level: {
        type: String,
        default: '',
        enum: [
            '', // 普通用户
            'A', // 管理员
            'M', // 项目经理
        ],
    }, // mac等级
};

var dataSchema = Schema(data);

dataSchema.statics.getGroupId = async function (id) {
    var res = await this.findById(id);

    return res.groupid;
}

dataSchema.statics.getLevel = async function (id) {
    var res = await this.findById(id);

    return res.level;
}

/**
 * 用户所有的权限列表
 * @param {String} id 用户主键
 * @returns 权限列表
 */
dataSchema.statics.getAuth = async function (id) {
    const level = await this.getLevel(id);

    var auths = await Authority.findAuthsByLevel(level);

    return auths;
}

/**
 * 用户是否有某权限
 * @param {String} id 用户主键
 * @param {String} name 权限name
 * @returns true/false
 */
dataSchema.statics.hasAuth = async function (id, name) {
    const auth = await this.getAuth(id);

    return auth.includes(name);
}

var Data = mongoose.model('user', dataSchema);

// dataSchema.methods.getTime

// dataSchema.query.addIndex = function() {
    
// }

// var row = {
//     loginname: 'yzh',
//     pwd: '594250',
//     truename: 'yzh',
//     addtime: app.getTime(),
// };

// Data.create(row, (err, doc) => {
//     console.log(row)
// })

// Data.find({addtime: {$gt: '2022-05-01', $lt:'2022-12-31'}}).then(res => {
//     console.log(res);
// });

// Data.findObe({username: 'yzh'}).then(res => {
//     console.log(res);
// });

module.exports = Data;
