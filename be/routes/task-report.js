var express = require('express');
var router = express.Router();

const resFrame = require('../utils/resFrame');
const app = require('../utils/app');

const TaskReport = require('../db/schema/task-report');
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
            $gte: starttime,
            $lt: endtime,
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

        // 存储项目信息
        TaskReport.create(form, (err, data) => {
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

module.exports = router;
