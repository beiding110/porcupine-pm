var express = require('express');
var router = express.Router();

const resFrame = require('../utils/resFrame');
const app = require('../utils/app');

const TaskReport = require('../db/schema/task-report');
const Project = require('../db/schema/project');
const Chain = require('../utils/Chain');

router.get('/list', function (req, res, next) {
    const {procode, taskcode, starttime, endtime, member} = req.query,
        {ppm_userid} = req.cookies;

    // 未登录
    if (!ppm_userid) {
        tdata = resFrame('login-index', '', '身份过期，请重新登录');

        res.send(tdata);

        return false;
    }

    var search = {
        adduser: ppm_userid,
        scbj: {
            $ne: 1,
        },
    };

    if (procode) {
        search.procode = procode;
    }

    if (taskcode) {
        search.taskcode = taskcode;
    }

    if (starttime && endtime) {
        search.reporttime = {
            $gt: starttime,
            $lte: endtime,
        };
    }

    if (member) {
        search.member = member;
    }

    var taskRepData,
        taskRepWithMemberData;

    new Chain().link(next => {
        TaskReport.find(search, null, {
            sort: {
                reporttime: -1,
            },
        }, (err, data) => {
            if (err) {
                tdata = resFrame('error', '', err);
                res.send(tdata);
                return false;
            }

            taskRepData = data;

            next();
        });
    }).link(next => {
        TaskReport.populate(taskRepData, [
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

            taskRepWithMemberData = data;

            next();
        });
    }).link(next => {
        tdata = resFrame(taskRepWithMemberData);
        res.send(tdata);
    }).run();
});

router.get('/all', function (req, res, next) {
    const {time} = req.query,
        {ppm_userid} = req.cookies;

    // 未登录
    if (!ppm_userid) {
        tdata = resFrame('login-index', '', '身份过期，请重新登录');

        res.send(tdata);

        return false;
    }

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

    var taskReportData;

    new Chain().link(next => {
        TaskReport.getAllByUser(ppm_userid, search, (err, data) => {
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

router.post('/form', function (req, res, next) {
    const form = req.body,
        {ppm_userid} = req.cookies;

    var tdata;

    // 未登录
    if (!ppm_userid) {
        tdata = resFrame('login-index', '', '身份过期，请重新登录');

        res.send(tdata);

        return false;
    }


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

    // 未登录
    if (!ppm_userid) {
        tdata = resFrame('login-index', '', '身份过期，请重新登录');

        res.send(tdata);

        return false;
    }

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

router.get('/hotmap', function (req, res, next) {
    const {starttime, endtime, member} = req.query,
        {ppm_userid} = req.cookies;

    // 未登录
    if (!ppm_userid) {
        tdata = resFrame('login-index', '', '身份过期，请重新登录');

        res.send(tdata);

        return false;
    }

    var projectData,
        reportData;

    new Chain().link(next => {
        Project.getUsersPro(ppm_userid, (err, data) => {
            if (err) {
                tdata = resFrame('error', '', err);
                res.send(tdata);
                return false;
            }

            projectData = data;
    
            next();
        });
    }).link(next => {
        function whereFac() {
            var start = new Date(starttime).getTime(),
                end = new Date(endtime).getTime();

            return `new Date(this['reporttime']).getTime() > ${start} && new Date(this['reporttime']).getTime() <= ${end}`;
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

    // 未登录
    if (!ppm_userid) {
        tdata = resFrame('login-index', '', '身份过期，请重新登录');

        res.send(tdata);

        return false;
    }

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

module.exports = router;
