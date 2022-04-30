var express = require('express');
var router = express.Router();

const resFrame = require('../utils/resFrame');
const app = require('../utils/app');

const Project = require('../db/schema/project');
const ProjectMember = require('../db/schema/project-member');

router.get('/list', function (req, res, next) {
    const {title, starttime, endtime} = req.query,
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
        search.proname = {
            $regex: new RegExp(title, 'i'),
        };
    }

    if (starttime && endtime) {
        search.addtime = {
            $gte: starttime,
            $lt: endtime,
        };
    }

    Project.find(search, (err, data) => {
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

    // 判断未添加的成员
    var memberNotSave = form.member.filter(item => {
        return !item._id;
    });

    ProjectMember.find({
        adduser: ppm_userid,
    }, (err, data) => {
        if (err) {
            tdata = resFrame('error', '', err);
            res.send(tdata);
            return false;
        }

        var {
            inc: memberExistInDb,
            right: memberToInsert,
        } = app.calcIntersection(data, form.member, (item1, item2) => item1.name === item2.name);

        var insertData = memberToInsert.map(item => {
            return {
                ...item,
                adduser: ppm_userid,
                addtime: app.getTime(),
            }
        })

        // 存储新增的项目成员
        ProjectMember.insertMany(insertData, (err, data) => {
            if (err) {
                tdata = resFrame('error', '', err);
                res.send(tdata);
                return false;
            }

            var newInsertedId =  data.map(item => item.id);

            form.member = [
                ...newInsertedId,
                ...memberExistInDb,
            ];

            if (form._id) {
                // 编辑
    
                // 更新项目信息
                Project.findByIdAndUpdate(form._id, form, (err, data) => {
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
                Project.create(form, (err, data) => {
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
    });
});

router.get('/detail', function (req, res, next) {
    const {procode} = req.query,
        {ppm_userid} = req.cookies;

    // 未登录
    if (!ppm_userid) {
        tdata = resFrame('login-index', '', '身份过期，请重新登录');

        res.send(tdata);

        return false;
    }

    Project.findById(procode, (err, project) => {
        if (err) {
            tdata = resFrame('error', '', err);
            res.send(tdata);
            return false;
        }

        Project.populate(project, 'member', (err, data) => {
            if (err) {
                tdata = resFrame('error', '', err);
                res.send(tdata);
                return false;
            }

            tdata = resFrame(data);
            res.send(tdata);
        });
    });
});

router.post('/del', function (req, res, next) {
    const {procode} = req.body,
        {ppm_userid} = req.cookies;

    var tdata;

    // 未登录
    if (!ppm_userid) {
        tdata = resFrame('login-index', '', '身份过期，请重新登录');

        res.send(tdata);

        return false;
    }

    if (!procode) {
        tdata = resFrame('error', '', '请选择要删除的项');

        res.send(tdata);

        return false;
    }

    Project.findByIdAndUpdate(procode, {
        scbj: 1
    }, (err, data) => {
        if (err) {
            tdata = resFrame('error', '', err);
            res.send(tdata);
            return false;
        }

        tdata = resFrame(data);
        res.send(tdata);
    });
});

module.exports = router;
