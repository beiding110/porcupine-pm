var express = require('express');
var router = express.Router();

const resFrame = require('../utils/resFrame');
const app = require('../utils/app');

const TaskGroup = require('../db/schema/task-group');
const Project = require('../db/schema/project');

router.get('/list', function (req, res, next) {
    const {title, procode} = req.query,
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

    if (title) {
        search.title = {
            $regex: new RegExp(title, 'i'),
        };
    }

    if (procode) {
        search.procode = procode;
    }

    TaskGroup.find(search, (err, data) => {
        if (err) {
            tdata = resFrame('error', '', err);
            res.send(tdata);
            return false;
        }

        tdata = resFrame(data);
        res.send(tdata);
    });
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
        TaskGroup.findByIdAndUpdate(form._id, form, (err, data) => {
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
        TaskGroup.create(form, (err, data) => {
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

router.post('/del', function (req, res, next) {
    const {_id} = req.body,
        {ppm_userid} = req.cookies;

    var tdata;

    // 未登录
    if (!ppm_userid) {
        tdata = resFrame('login-index', '', '身份过期，请重新登录');

        res.send(tdata);

        return false;
    }

    if (!_id) {
        tdata = resFrame('error', '', '请选择要删除的项');

        res.send(tdata);

        return false;
    }

    TaskGroup.findByIdAndUpdate(_id, {
        scbj: 1
    }, (err, data) => {
        if (err) {
            tdata = resFrame('error', '', err);
            res.send(tdata);
            return false;
        }

        // TODO: 同时需要移除task；

        tdata = resFrame(data);
        res.send(tdata);
    });
});

module.exports = router;
