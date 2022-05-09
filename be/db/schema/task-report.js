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
    var projectData,
        reportData;

    new Chain().link(next => {
        Project.getUsersPro(userid, (err, data) => {
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

dataSchema.statics.buildByProject = function(arr, cb) {
    var arrRebuild = [];

    arrRebuild = arr.reduce((proarr, item) => {
        var project = item.procode,
            member = item.member,
            indexInArr;

        if (!proarr.some((pro, existIndex) => {
            if (pro.id === project.id) {
                indexInArr = existIndex;

                return true;
            }

            return false;
        })) {
            // 数组中不存在项目

            proarr.push({
                proname: project.proname,
                id: project.id,
                tasktime: item.tasktime,
                member: [
                    {
                        name: member.name,
                        id: member.id,
                        tasktime: item.tasktime,
    
                        report: [
                            {
                                reporttime: item.reporttime,
                                tasktime: item.tasktime,
                                reporttimes: 1,
                            },
                        ],
                    },
                ],
            });
        } else {
            // 数组中存在项目

            var existProinfo = proarr[indexInArr],
                existMemberIndex;

            existProinfo.tasktime += item.tasktime;

            if (!existProinfo.member.some((member, memberIndex) => {
                if (member.id === item.member.id) {
                    existMemberIndex = memberIndex;
                    return true;
                }

                return false;
            })) {
                // 列表里没这个人

                existProinfo.member.push({
                    name: member.name,
                    id: member.id,
                    tasktime: item.tasktime,

                    report: [
                        {
                            reporttime: item.reporttime,
                            tasktime: item.tasktime,
                            reporttimes: 1,
                        },
                    ],
                });
            } else {
                // 列表里有这个人

                existProinfo.member[existMemberIndex].tasktime += item.tasktime;

                var existDateIndex,
                    report = existProinfo.member[existMemberIndex].report;

                if (!report.some((reportItem, reportIndex) => {
                    if (reportItem.reporttime === item.reporttime) {
                        existDateIndex = reportIndex;

                        return true;
                    }

                    return false;
                })) {
                    // 数组里不存在这天的记录

                    report.push({
                        reporttime: item.reporttime,
                        tasktime: item.tasktime,
                        reporttimes: 1,
                    });
                } else {
                    // 数组里存在这天的记录

                    report[reportIndex].tasktime += item.tasktime;
                    report[reportIndex].reporttimes ++;
                }
            }
        }

        return proarr;
    }, []);

    cb && cb(arrRebuild);
};

var Data = mongoose.model('task-report', dataSchema);

module.exports = Data;
