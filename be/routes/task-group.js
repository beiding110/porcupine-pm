var express = require('express');
var router = express.Router();

const resFrame = require('../utils/resFrame');
const app = require('../utils/app');

const Project = require('../db/schema/project');
const ProjectMember = require('../db/schema/project-member');
const TaskGroup = require('../db/schema/task-group');
const Task = require('../db/schema/task');
const OrderGroup = require('../db/schema/order-group');
const User = require('../db/schema/user.js');
const TaskStateMember = require('../db/schema/task-state-member.js');

const isLogin = require('../middleware/is-login');
router.use(isLogin);

router.get('/list', async function (req, res, next) {
    var tdata;

    try {
        const {title, procode} = req.query,
            {ppm_userid} = req.cookies;

        const level = await User.getLevel(ppm_userid); // 当前用户的权限等级

        var groupSearch = {
                scbj: {
                    $ne: 1,
                },
            },
            taskSearch = {};

        if (title) {
            groupSearch.title = {
                $regex: new RegExp(title, 'i'),
            };
        }

        if (procode) {
            groupSearch.procode = procode;
        } else {
            let usersPro = await Project.getUsersPro(ppm_userid);

            groupSearch.procode = usersPro.map(item => item.id);
        }

        if (level === 'A') {
            // 组织下全部的
            let usersPro = await Project.getUsersPro(ppm_userid);

            // 组织内全部的
            taskSearch.procode = usersPro.map(item => item.id);
        } else if (level === 'M') {
            // 本人创建的项目的和本人参与的

            let userCreatedPro = await Project.find({
                    adduser: ppm_userid,
                }),
                userInPM = await ProjectMember.getUserInProMember(ppm_userid);

            taskSearch['$or'] = [
                {
                    procode: userCreatedPro.map(item => item.id),
                },
                {
                    member: userInPM.id,
                }
            ];
        } else {
            // 只能看人员里有自己的
            var userInPM = await ProjectMember.getUserInProMember(ppm_userid);

            taskSearch.member = userInPM.id;
        }

        var groupWithTaskData = await TaskGroup.find(groupSearch, null, {
            sort: {
                order: 1,
                addtime: 1,
            },
        }).populate({
            path: 'task',
            match: taskSearch,
            options: {
                order: 1,
                addtime: 1,
            },
            populate: {
                path: 'member',
            },
        });

        // 排序
        var listWithOrder = await OrderGroup.bindOrder(ppm_userid, 'task-group:project-task', groupWithTaskData);

        for (let i = 0; i < listWithOrder.length; i ++) {
            let group = listWithOrder[i];

            // 给task绑定排序
            await OrderGroup.bindOrder(ppm_userid, 'task:project-group', group.task);

            // 给task绑定状态
            await TaskStateMember.bindStateFromTSM(ppm_userid, group.task);
        }

        tdata = resFrame(listWithOrder);
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

        // 分组中的任务同步修改scbj
        Task.delRows(data.task);

        tdata = resFrame(data);
        res.send(tdata);
    });
});

router.post('/updateorder', async function (req, res, next) {
    var tdata;

    try {
        const orderArr = req.body,
            {ppm_userid} = req.cookies;

        var data = await OrderGroup.updateOrder(ppm_userid, 'task-group:project-task', orderArr);

        tdata = resFrame(data);
        res.send(tdata);
    } catch(e) {
        tdata = resFrame('error', '', e);
        res.send(tdata);
    }
});

module.exports = router;
