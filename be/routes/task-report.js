var express = require('express');
var router = express.Router();

const resFrame = require('../utils/resFrame');
const app = require('../utils/app');

const TaskReport = require('../db/schema/task-report');
const Project = require('../db/schema/project');
const ProjectMember = require('../db/schema/project-member');
const User = require('../db/schema/user.js');
const Chain = require('../utils/Chain');

const isLogin = require('../middleware/is-login');
router.use(isLogin);

router.get('/list', async function (req, res, next) {
    var tdata;

    try {
        const {procode, taskcode, starttime, endtime, member} = req.query,
            {ppm_userid} = req.cookies;

        var level = await User.getLevel(ppm_userid),
            userInPM = await ProjectMember.getUserInProMember(ppm_userid),
            search = {
                scbj: {
                    $ne: 1,
                },
            };

        if (level === 'A') {
            // 管理员权限，读取全部项目
            let usersPro = await Project.getUsersPro(ppm_userid);

            // 组织内全部的
            search.procode = usersPro.map(item => item.id);
        } else if (level === 'M') {
            // 项目经理权限，读取自己创建的或参与的

            let userCreatedPro = await Project.find({
                adduser: ppm_userid,
            });

            search['$or'] = [
                {
                    procode: userCreatedPro.map(item => item.id),
                },
                {
                    member: userInPM._id,
                }
            ];
        } else {
            // 仅本人参与的
            search.member = userInPM.id;
        }

        if (procode) {
            search.procode = procode;
        }

        if (taskcode) {
            search.taskcode = taskcode;
        }

        if (starttime && endtime) {
            search.reporttime = {
                $gte: `${starttime}`,
                $lte: `${endtime}`,
            };
        }

        if (member) {
            search.member = member;
        }

        var taskRepWithMemberData = await TaskReport.find(search, null, {
            sort: {
                reporttime: -1,
                addtime: -1,
            },
        }).populate([
            {
                path: 'member',
            },
            {
                path: 'taskcode',
            },
        ]);

        tdata = resFrame(taskRepWithMemberData);
        res.send(tdata);
    } catch(e) {
        tdata = resFrame('error', '', e);
        res.send(tdata);
    }
});

router.get('/all', async function (req, res, next) {
    var tdata;

    try {
        const {time} = req.query,
            {ppm_userid} = req.cookies;

        var starttime,
            endtime,
            search = {};

        if(time) {
            var dateTime = new Date(time),
                monthTime = dateTime.getMonth();

            starttime = new Date(time)
            starttime.setMonth(monthTime - 1);
            starttime.setDate(1);
            starttime = starttime.getTime();

            endtime = new Date(time)
            endtime.setMonth(monthTime + 2);
            endtime.setDate(1);
            endtime = endtime.getTime();

            search = {
                $where: `new Date(this['reporttime']).getTime() > ${starttime} && new Date(this['reporttime']).getTime() <= ${endtime}`
            };
        }

        var taskReportData = await TaskReport.getAllByUser(ppm_userid, search);

        tdata = resFrame(taskReportData);
        res.send(tdata);
    } catch(e) {
        tdata = resFrame('error', '', e);
        res.send(tdata);
    }
});

router.post('/form', function (req, res, next) {
    const form = req.body,
        {ppm_userid} = req.cookies;

    var tdata;

    if (form._id) {
        // 编辑

        // 更新项目信息
        TaskReport.findByIdAndUpdate(form._id, form, (err, data) => {
            if (err) {
                tdata = resFrame('error', '', err);
                res.send(tdata);
                return false;
            }
    
            tdata = resFrame(data);
            res.send(tdata);
        });
        
    } else {
        // 新增

        form.adduser = ppm_userid;
        form.addtime = app.getTime();

        var member = form.member,
            createData;

        if (typeof member === 'string') {
            createData = form
        } else if (typeof member === 'object') {
            var createData = member.map(item => {
                return {
                    ...form,
                    member: item,
                };
            });
        } else {
            tdata = resFrame('error', '', '错误的member格式');
            res.send(tdata);
            return false;
        }

        TaskReport.create(createData, (err, data) => {
            if (err) {
                tdata = resFrame('error', '', err);
                res.send(tdata);
                return false;
            }

            tdata = resFrame(data);
            res.send(tdata);
        });
    }
});

router.get('/detail', function (req, res, next) {
    const {_id} = req.query,
        {ppm_userid} = req.cookies;

    var taskReportData;

    new Chain().link(next => {
        TaskReport.findById(_id, (err, data) => {
            if (err) {
                tdata = resFrame('error', '', err);
                res.send(tdata);
                return false;
            }

            taskReportData = data;
    
            next();
        });
    }).link(next => {
        tdata = resFrame(taskReportData);
        res.send(tdata);
    }).run();
});

router.get('/hotmap', async function (req, res, next) {
    const {starttime, endtime, member} = req.query,
        {ppm_userid} = req.cookies;

    var projectData = await Project.getUsersPro(ppm_userid, true),
        reportData;

    new Chain().link(next => {
        function whereFac() {
            var start = new Date(starttime).getTime(),
                end = new Date(endtime).getTime() + 86400000;

            return `new Date(this['reporttime']).getTime() >= ${start} && new Date(this['reporttime']).getTime() < ${end}`;
        }

        var search = {
            procode: {
                $in: projectData.map(item => item._id),
            },
            $where: whereFac(),
        };

        if (member) {
            search.member = member;
        }
            
        TaskReport.find(search, (err, data) => {
            if (err) {
                tdata = resFrame('error', '', err);
                res.send(tdata);
                return false;
            }

            reportData = data;

            next();
        });
    }).link(next => {
        TaskReport.populate(reportData, [
            {
                path: 'member',
            },
            {
                path: 'procode',
            },
        ], (err, data) => {
            if (err) {
                tdata = resFrame('error', '', err);
                res.send(tdata);
                return false;
            }

            reportData = data;

            next();
        });
    }).link(next => {
        var rebuild;
        
        TaskReport.buildByProject(reportData, data => {
            rebuild = data;

            tdata = resFrame(rebuild);
            res.send(tdata);
        });
    }).run();
});

router.get('/hotmapbyproject', function (req, res, next) {
    const {procode} = req.query,
        {ppm_userid} = req.cookies;

    var reportData;

    new Chain().link(next => {            
        TaskReport.find({
            procode: procode,
        }, null, {
            sort: {
                reporttime: 1,
            },
        }, (err, data) => {
            if (err) {
                tdata = resFrame('error', '', err);
                res.send(tdata);
                return false;
            }

            reportData = data;

            next();
        });
    }).link(next => {
        TaskReport.populate(reportData, [
            {
                path: 'member',
            },
            {
                path: 'procode',
            },
        ], (err, data) => {
            if (err) {
                tdata = resFrame('error', '', err);
                res.send(tdata);
                return false;
            }

            reportData = data;

            next();
        });
    }).link(next => {
        var rebuild,
            rangeStart = (reportData[0] || {}).reporttime,
            rangeEnd = (reportData[reportData.length - 1] || {}).reporttime;
        
        TaskReport.buildByProject(reportData, data => {
            rebuild = data;

            tdata = resFrame({
                data: rebuild,
                range: [rangeStart, rangeEnd],
            });
            res.send(tdata);
        });
    }).run();
});

router.get('/hotmapbytask', function (req, res, next) {
    const {procode} = req.query,
        {ppm_userid} = req.cookies;

    var reportData;

    new Chain().link(next => {            
        TaskReport.find({
            procode: procode,
        }, null, {
            sort: {
                reporttime: 1,
            },
        }, (err, data) => {
            if (err) {
                tdata = resFrame('error', '', err);
                res.send(tdata);
                return false;
            }

            reportData = data;

            next();
        });
    }).link(next => {
        TaskReport.populate(reportData, [
            {
                path: 'member',
            },
            {
                path: 'taskcode',
            },
        ], (err, data) => {
            if (err) {
                tdata = resFrame('error', '', err);
                res.send(tdata);
                return false;
            }

            reportData = data;

            next();
        });
    }).link(next => {
        var rebuild,
            rangeStart = (reportData[0] || {}).reporttime,
            rangeEnd = (reportData[reportData.length - 1] || {}).reporttime;
        
        TaskReport.buildByTask(reportData, data => {
            rebuild = data;

            tdata = resFrame({
                data: rebuild,
                range: [rangeStart, rangeEnd],
            });
            res.send(tdata);
        });
    }).run();
});

/**
 * 人员-项目占用情况
 */
router.get('/pppercent', async function (req, res, next) {
    const {starttime, endtime, member} = req.query,
        {ppm_userid} = req.cookies;

    var projectData = await Project.getUsersPro(ppm_userid, true),
        reportData,
        activeProjects, // 实际日志的项目
        rows;

    new Chain().link(next => {
        // 取当前用户在时间范围内项目的日志上报情况

        function whereFac() {
            var start = new Date(starttime).getTime(),
                end = new Date(endtime).getTime() + 86400000;

            return `new Date(this['reporttime']).getTime() >= ${start} && new Date(this['reporttime']).getTime() < ${end}`;
        }

        var search = {
            procode: {
                $in: projectData.map(item => item._id),
            },
            $where: whereFac(),
        };

        if (member) {
            search.member = member;
        }
            
        TaskReport.find(search, (err, data) => {
            if (err) {
                tdata = resFrame('error', '', err);
                res.send(tdata);
                return false;
            }

            reportData = data;

            next();
        });
    }).link(next => {
        // 关联日志的添加人和项目信息

        TaskReport.populate(reportData, [
            {
                path: 'member',
            },
            {
                path: 'procode',
            },
        ], (err, data) => {
            if (err) {
                tdata = resFrame('error', '', err);
                res.send(tdata);
                return false;
            }

            reportData = data;

            next();
        });
    }).link(next => {
        // 获取实际有日志的项目

        activeProjects = reportData.reduce((proArr, report) => {
            if (!proArr.some(pro => {
                return pro.id === report.procode.id;
            })) {
                // 不存在

                proArr.push(report.procode);
            }

            return proArr;
        }, []);

        next();
    }).link(next => {
        // 构建用户与工时的关联关系

        rows = reportData.reduce((memberArr, item) => {
            var project = item.procode,
                member = item.member,
                indexInArr;

            if (!memberArr.some((mem, existIndex) => {
                if (mem.id === member.id) {
                    indexInArr = existIndex;
    
                    return true;
                }
    
                return false;
            })){
                // 数组中不存在这个人员

                memberArr.push({
                    name: member.name,
                    id: member.id,
                    sum: item.tasktime,
                    project: activeProjects.map(pro => {
                        let sum = 0;

                        if (pro.id === project.id) {
                            sum = item.tasktime
                        }

                        return {
                            name: pro.proname,
                            id: pro.id,
                            sum,
                        }
                    }),
                });
            } else {
                // 数组中已经存在这个人员

                var existMemberinfo = memberArr[indexInArr],
                    existProIndex;

                existMemberinfo.sum += item.tasktime;

                existProIndex = existMemberinfo.project.findIndex(pro => {
                    return pro.id === item.procode.id;
                });

                existMemberinfo.project[existProIndex].sum += item.tasktime;
            }

            return memberArr;
        }, []);

        next();
    }).link(next => {
        // 计算比例
        rows.forEach(member => {
            member.project.forEach(project => {
                if (member.sum) {
                    // 用户总工时不为0

                    project.normalize = Number((project.sum / member.sum).toFixed(2));

                    project.percent = parseInt(project.normalize * 100) + '%';

                    return;
                }

                project.normalize = 0;
            });
        });

        tdata = resFrame({
            row: rows,
            col: activeProjects,
        });

        res.send(tdata);
    }).run();
});

router.get('/monthly', async function (req, res, next) {
    var tdata;

    try {
        const {time} = req.query,
            {ppm_userid} = req.cookies;

        var reportData;

        if(time) {
            var dateTime = new Date(time),
                monthTime = dateTime.getMonth();
    
            starttime = new Date(time);
            starttime.setDate(1);
            starttime.setHours(0, 0, 0, 0);
            starttime = starttime.getTime();
    
            endtime = new Date(time);
            endtime.setMonth(monthTime + 1);
            endtime.setDate(0);
            endtime.setHours(23, 59, 59, 0);
            endtime = endtime.getTime();
    
            search = {
                $where: `new Date(this['reporttime']).getTime() > ${starttime} && new Date(this['reporttime']).getTime() <= ${endtime}`
            };
        }

        reportData = await TaskReport.getAllByUser(ppm_userid, search);
        reportData = await TaskReport.populate(reportData, [
            {
                path: 'taskcode',
            },
        ]);

        var members = [],
            dates = [];

        reportData.forEach(report => {
            if (!members.some(member => {
                return member.id === report.member.id;
            })) {
                members.push(report.member);
            }

            var matchedIndex,
                newItem = {
                    detail: report.detail,
                    proname: report.procode.proname,
                    taskname: report.taskcode.title,
                };

            if (!dates.some((day, di) => {
                if (day.reporttime === report.reporttime) {
                    matchedIndex = di;
                    return true;
                }

                return false;
            })) {
                dates.push({
                    reporttime: report.reporttime,
                    [report.member.id]: [
                        newItem,
                    ]
                });
            } else {
                if (dates[matchedIndex][report.member.id]) {
                    dates[matchedIndex][report.member.id].push(newItem);
                } else {
                    dates[matchedIndex][report.member.id] = [
                        newItem,
                    ];
                }
            }
        });

        tdata = resFrame({
            rows: dates.sort((a, b) => {
                return new Date(a.reporttime) - new Date(b.reporttime);
            }),
            cols: members,
        });
        res.send(tdata);
    } catch(e) {
        tdata = resFrame('error', '', e);
        res.send(tdata);
    }
});

module.exports = router;
