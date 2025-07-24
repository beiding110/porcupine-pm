var express = require('express');
var router = express.Router();
const {Types} = require('mongoose');

const resFrame = require('../utils/resFrame');
const app = require('../utils/app');

const Project = require('../db/schema/project');
const ProjectMember = require('../db/schema/project-member');
const OrderGroup = require('../db/schema/order-group');
const User = require('../db/schema/user.js');

const isLogin = require('../middleware/is-login');
router.use(isLogin);

router.get('/list', async function (req, res, next) {
    var tdata;

    try {
        const {title, starttime, endtime} = req.query,
            {ppm_userid} = req.cookies;

        var groupid = await User.getGroupId(ppm_userid), // 当前用户的组织id
            level = await User.getLevel(ppm_userid); // 当前用户的权限等级

        var search = {
            scbj: {
                $ne: 1,
            },
        };

        if (level === 'A') {
            // 管理员权限，读取全部项目
            search.groupid = groupid;
        } else if (level === 'M') {
            // 项目经理权限，读取自己创建的或参与的

            // 当前用户的projectMemberId
            let userInPM = await ProjectMember.getUserInProMember(ppm_userid);

            search['$or'] = [
                {
                    adduser: ppm_userid,
                },
                {
                    'member': userInPM._id,
                }
            ];
        } else {
            // 无权限，读取自己参与的

            // 当前用户的projectMemberId
            let userInPM = await ProjectMember.getUserInProMember(ppm_userid);

            search.member = userInPM.id;
        }

        if (title) {
            search.proname = {
                $regex: new RegExp(title, 'i'),
            };
        }

        if (starttime && endtime) {
            search.addtime = {
                $gte: `${starttime} 00:00:00`,
                $lte: `${endtime} 23:59:59`,
            };
        }

        // 获取项目列表
        var list = await Project.find(search, null, {
            sort: {
                addtime: -1,
            },
        });

        var listWithOrder = await OrderGroup.bindOrder(ppm_userid, 'project', list);

        tdata = resFrame(listWithOrder);
        res.send(tdata);
    } catch (e) {
        tdata = resFrame('error', '', e);
        res.send(tdata);
    }
});

router.post('/form', async function (req, res, next) {
    var tdata;

    try {
        const form = req.body,
            {ppm_userid} = req.cookies;

        var groupid = await User.getGroupId(ppm_userid); // 当前用户的组织id

        ProjectMember.find({
            groupid,
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
                    groupid,
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
                    form.groupid = groupid;
        
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
    } catch(e) {
        tdata = resFrame('error', '', e);
        res.send(tdata);
    }
});

router.get('/detail', function (req, res, next) {
    const {procode} = req.query,
        {ppm_userid} = req.cookies;

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

// 更新分组及排序
router.post('/updatedrag', async function (req, res, next) {
    var tdata;

    try {
        const proArr = req.body,
            {ppm_userid} = req.cookies;

        var data = await OrderGroup.updateOrder(ppm_userid, 'project', proArr);

        tdata = resFrame(data);
        res.send(tdata);
    } catch(e) {
        tdata = resFrame('error', '', e);
        res.send(tdata);
    }
});

module.exports = router;
