const {Types} = require('mongoose');

const mongoose = require('../index.js');
const User = require('./user.js');
const ProjectMember = require('./project-member');

var Schema = mongoose.Schema;

let data = {
    taskid: {
        type: Schema.Types.ObjectId,
        ref: 'task',
    },
    memberid: {
        type: Schema.Types.ObjectId,
        ref: 'project-member',
    },
    state: {
        type: String,
        enum: [
            '0', // 待办
            '1', // 未开始
            '2', // 进行中
            '3', // 已完成
            '4', // 已归档
        ],
    },
    addtime: {
        type: Date,
        default: Date.now(),
    },
};

var dataSchema = Schema(data);

/**
 * 给任务列表绑定当前用户的状态
 * @param {String} userid 用户主键
 * @param {Array} tasks 任务列表
 * @returns 处理后的任务列表
 */
dataSchema.statics.bindStateFromTSM = async function(userid, tasks) {
    var level = await User.getLevel(userid),
        tasksId = tasks.map(item => {
            return item.id;
        }),
        tsmData;

    if (['A', 'M'].includes(level)) {
        tasks.forEach(task => {
            task._doc.statelimit = '';
        });
    } else {
        let userInPM = await ProjectMember.getUserInProMember(userid);

        tsmData = await this.find({
            taskid: tasksId,
            memberid: userInPM,
        });

        for (let i = 0; i < tasks.length; i ++) {
            let task = tasks[i];

            var linkItem = await tsmData.find(item => {
                return item.taskid.equals(task.id);
            });

            if (!linkItem) {
                continue;
            }

            task._doc.statelimit = task.state;

            task.state = linkItem.state;
        }
    }
    
    return tasks;
};

var Data = mongoose.model('task-state-member', dataSchema);

module.exports = Data;
