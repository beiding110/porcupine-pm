var express = require('express');
var router = express.Router();

const resFrame = require('../utils/resFrame');

const Project = require('../db/schema/project');
const ProjectMember = require('../db/schema/project-member');

const Chain = require('../utils/Chain');

router.get('/list', function (req, res, next) {
    const {procode} = req.query,
        {ppm_userid} = req.cookies;

    // 未登录
    if (!ppm_userid) {
        tdata = resFrame('login-index', '', '身份过期，请重新登录');

        res.send(tdata);

        return false;
    }

    if (procode) {
        // 有procode，取对应项目的

        var proData;

        new Chain().link(next => {
            Project.findById(procode, (err, data) => {
                if (err) {
                    tdata = resFrame('error', '', err);
                    res.send(tdata);
                    return false;
                }
        
                proData = data;
    
                next();
            });     
        }).link(next => {
            Project.populate(proData, 'member', (err, data) => {
                if (err) {
                    tdata = resFrame('error', '', err);
                    res.send(tdata);
                    return false;
                }
        
                tdata = resFrame(data.member);
                res.send(tdata);
            });
        }).run();

    } else {
        // 没有procode，取该用户全部的
        
        ProjectMember.find({
            adduser: ppm_userid,
        }, (err, data) => {
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

module.exports = router;
