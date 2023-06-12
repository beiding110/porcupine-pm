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
    level: String, // mac等级，A/M
};

var dataSchema = Schema(data);

dataSchema.statics.getGroupId = async function (id) {
    return new Promise((res, rej) => {
        this.findById(id, (err, data) => {
            if (err) {
                rej(err);
            }
    
            res(data.groupid);
        });
    });
}

dataSchema.statics.getLevel = async function (id) {
    return new Promise((res, rej) => {
        this.findById(id, (err, data) => {
            if (err) {
                rej(err);
            }
    
            res(data.level);
        });
    });
}

/**
 * 用户所有的权限列表
 * @param {String} id 用户主键
 * @returns 权限列表
 */
dataSchema.statics.getAuth = async function (id) {
    const level = await this.getLevel(id);

    var auth = await Authority.find({
        roles: level,
    });

    return auth.map(item => item.name);
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
