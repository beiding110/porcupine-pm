const mongoose = require('../index.js');
const app = require('../../utils/app');

var Schema = mongoose.Schema;

let data = {
    loginname: String,
    pwd: String,
    truename: String,
    addtime: String,
    groupid: String,
    level: String, // mac等级，A/M/W
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
