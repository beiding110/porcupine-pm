const mongoose = require('../index.js');

var Schema = mongoose.Schema;

let data = {
    name: {
        type: String,
        default: '',
    },
    description: {
        type: String,
        default: '',
    },
    roles: [
        {
            type: String,
        },
    ],
};

var dataSchema = Schema(data);

dataSchema.statics.findAuthsByLevel = async function (level) {
    var auths = await this.find({
        roles: level,
    });

    return auths.map(item => item.name);
};

var Data = mongoose.model('authority', dataSchema);

/**
Data.insertMany([
    {
        name: 'project-edit',
        description: '增改项目',
        roles: ['A', 'M'],
    },
    {
        name: 'project-del',
        description: '删除项目',
        roles: ['A'],
    },
    {
        name: 'task-group-edit',
        description: '增改任务分组',
        roles: ['A', 'M'],
    },
    {
        name: 'task-group-del',
        description: '删除任务分组',
        roles: ['A'],
    },
    {
        name: 'task-edit',
        description: '增改任务',
        roles: ['A', 'M'],
    },
    {
        name: 'task-del',
        description: '删除任务',
        roles: ['A'],
    },
    {
        name: 'task-file',
        description: '归档任务',
        roles: ['A', 'M'],
    },
    {
        name: 'gantt-view',
        description: '甘特图功能',
        roles: ['A', 'M'],
    },
    {
        name: 'settings-view',
        description: '设置功能',
        roles: ['A'],
    },
]);
 */

module.exports = Data;
