const mongoose = require('../index.js');
const Chain = require('../../utils/Chain');

const Project = require('./project');

var Schema = mongoose.Schema;

let data = {
    reporttime: String,
    tasktime: Number,
    member: {
        type: Schema.Types.ObjectId,
        ref: 'project-member'
    },
    detail: String,

    adduser: String,
    addtime: String,

    procode: {
        type: Schema.Types.ObjectId,
        ref: 'project'
    },
    taskcode: {
        type: Schema.Types.ObjectId,
        ref: 'task'
    },
    
    scbj: Number,
};

var dataSchema = Schema(data);

dataSchema.statics.getAllByUser = function(userid, cb) {
    var search = {
        scbj: {
            $ne: 1,
        },
        adduser: userid,
    };

    var projectData,
        reportData;

    new Chain().link(next => {
        Project.find(search, (err, data) => {
            if (err) {
                cb(err);
                return false;
            }

            projectData = data;
    
            next()
        });
    }).link(next => {
        this.find({
            procode: {
                $in: projectData.map(item => item._id),
            },
        }, (err, data) => {
            if (err) {
                cb(err);
            }

            reportData = data;

            next();
        });
    }).link(next => {
        this.populate(reportData, [
            {
                path: 'member',
            },
            {
                path: 'procode',
            },
        ], (err, data) => {
            if (err) {
                cb(err);
            }

            reportData = data;

            next();
        });
    }).link(next => {
        cb(null, reportData);
    }).run();
};

var Data = mongoose.model('task-report', dataSchema);

module.exports = Data;
