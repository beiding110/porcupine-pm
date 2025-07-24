var express = require('express');
var router = express.Router();

const {Types} = require('mongoose');

const resFrame = require('../utils/resFrame');
const app = require('../utils/app');
const Chain = require('../utils/Chain');

const Task = require('../db/schema/task');
const TaskGroup = require('../db/schema/task-group');
const Project = require('../db/schema/project');
const OrderGroup = require('../db/schema/order-group');
const ProjectMember = require('../db/schema/project-member');
const User = require('../db/schema/user.js');
const TaskStateMember = require('../db/schema/task-state-member.js');

const isLogin = require('../middleware/is-login');
router.use(isLogin);

router.get('/list', function (req, res, next) {
    const {title, procode, groupcode} = req.query,
        {ppm_userid} = req.cookies;

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

    if (groupcode) {
        search.groupcode = groupcode;
    }

    Task.find(search, (err, data) => {
        if (err) {
            tdata = resFrame('error', '', err);
            res.send(tdata);
            return false;
        }

        tdata = resFrame(data);
        res.send(tdata);
    });
});

router.get('/list-state', async function (req, res, next) {
    var tdata;

    try {
        const {procode} = req.query,
            {ppm_userid} = req.cookies;

        var taskData;
        let userInPM = await ProjectMember.getUserInProMember(ppm_userid),
            level = await User.getLevel(ppm_userid),
            search = {
                state: {
                    $ne: '4',
                },
            };

        if (level === 'A') {
            let usersPro = await Project.getUsersPro(ppm_userid);

            // 组织内全部的
            search.procode = usersPro.map(item => item.id);
        } else if (level === 'M') {
            // 本人创建的项目的和本人参与的

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

        if (!procode) {
            // 没有procode，按人查
            taskData = await Task.getList(search);
        } else {
            // 有procode，按项目查
            taskData = await Task.getList({
                ...search,
                procode,
            });
        }

        // 处理成员的state
        await TaskStateMember.bindStateFromTSM(ppm_userid, taskData);
        
        // 分组
        var tasks = await OrderGroup.bindOrder(ppm_userid, 'task', taskData),
            statsArr = [{state: '0', task: []}, {state: '1', task: []}, {state: '2', task: []}, {state: '3', task: []}];

        var regroup = tasks.reduce((arr, item) => {
            var state = item.state,
                stateIndexInArr;

            if (arr.some((arrItem, arrIndex) => {
                if (arrItem.state === state) {
                    stateIndexInArr = arrIndex;
                    return true;
                }

                return false;
            })) {
                // 有对应状态分组

                arr[stateIndexInArr].task.push(item);
            } else {
                // 没有对应状态分组

                arr.push({
                    state,
                    task: [item],
                });
            }

            return arr;
        }, statsArr);

        tdata = resFrame(regroup);
        res.send(tdata);
    } catch (e) {
        tdata = resFrame('error', '', e);
        res.send(tdata);
    }
});

router.get('/list-file', async function (req, res, next) {
    var tdata;

    try {
        const {procode, title, starttime, endtime} = req.query,
            {ppm_userid} = req.cookies;

        var search = {
            state: '4',
        };

        if (title) {
            search.title = {
                $regex: new RegExp(title, 'i'),
            };
        }

        if (starttime && endtime) {
            search.filetime = {
                $gte: `${starttime} 00:00:00`,
                $lte: `${endtime} 23:59:59`,
            };
        }

        var taskData;

        if (!procode) {
            // 没有procode，按人查
            var data = await Project.getUsersPro(ppm_userid, true);

            taskData = await Task.getList({
                procode: {
                    $in: data.map(item => item._id),
                },
                ...search,
            }, {
                filetime: -1,
            });
        } else {
            // 有procode，按项目查

            taskData = await Task.getList({
                procode,
                ...search,
            }, {
                filetime: -1,
            });
        }

        tdata = resFrame(taskData);
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

        // 更新分组信息
        var taskDataInDB;

        new Chain().link(next => {
            Task.findById(form._id, (err, data) => {
                if (err) {
                    tdata = resFrame('error', '', err);
                    res.send(tdata);
                    return false;
                }

                taskDataInDB = data;

                next();
            });
        }).link(next => {
            if (taskDataInDB.groupcode.toString() !== form.groupcode) {
                // 分组发生了变化

                // 移除旧分组中的task索引

                TaskGroup.removeTaskId(taskDataInDB.groupcode, form._id);

                // 给新分组增加task索引
                TaskGroup.addTaskId(form.groupcode, form._id);
            }

            next();
        }).run();


        // 更新任务信息
        var taskData;

        new Chain().link(next => {
            // 更新任务信息
            Task.findByIdAndUpdate(form._id, form, (err, data) => {
                if (err) {
                    tdata = resFrame('error', '', err);
                    res.send(tdata);
                    return false;
                }

                taskData = data;
        
                next();
            });
        }).link(next => {
            tdata = resFrame(taskData);
            res.send(tdata);
        }).run();
        
    } else {
        // 新增

        form.adduser = ppm_userid;
        form.addtime = app.getTime();
        form.state = form.state || '0';

        var taskData,
            taskGroupData;

        new Chain().link(next => {
            // 存储任务信息
            Task.create(form, (err, data) => {
                if (err) {
                    tdata = resFrame('error', '', err);
                    res.send(tdata);
                    return false;
                }

                taskData = data;

                next();
            });
        }).link(next => {
            // 更新任务组中的任务信息
            TaskGroup.findById(taskData.groupcode, (err, groupData) => {
                if (err) {
                    tdata = resFrame('error', '', err);
                    res.send(tdata);
                    return false;
                }

                taskGroupData = groupData;
                taskGroupData.task.push(taskData._id);

                next();
            });
        }).link(next => {
            // 存储任务组中的任务信息
            TaskGroup.findByIdAndUpdate(taskData.groupcode, taskGroupData, (err, groupData) => {
                if (err) {
                    tdata = resFrame('error', '', err);
                    res.send(tdata);
                    return false;
                }

                next();
            });
        }).link(next => {
            tdata = resFrame(taskData);
            res.send(tdata);
        }).run();
    }
});

router.get('/detail', async function (req, res, next) {
    var tdata;

    try {
        const {taskcode} = req.query,
            {ppm_userid} = req.cookies;

        var data = await Task.getRow(taskcode);

        tdata = resFrame(data);
        res.send(tdata);
    } catch(e) {
        tdata = resFrame('error', '', e);
        res.send(tdata);
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

    Task.findByIdAndUpdate(_id, {
        scbj: 1
    }, (err, data) => {
        if (err) {
            tdata = resFrame('error', '', err);
            res.send(tdata);
            return false;
        }

        // 移除组中的task
        TaskGroup.removeTaskId(data.groupcode, data.id);

        tdata = resFrame(data);
        res.send(tdata);
    });
});

router.post('/updatestete', async function (req, res, next) {
    var tdata;

    try {
        const {_id, state} = req.body,
            {ppm_userid} = req.cookies;

        if (!_id) {
            tdata = resFrame('error', '', '请选择要更新的项');

            res.send(tdata);

            return false;
        }

        const level = await User.getLevel(ppm_userid); // 当前用户的权限等级

        var data;

        if (['A', 'M'].includes(level)) {
            // 直接改变task的属性

            // 更新TaskStateMember
            TaskStateMember.updateMany({
                taskid: Types.ObjectId(_id),
                $where: `Number(${state}) > Number(this['state'])`,
            }, {
                state,
            });

            // 更新task本身状态
            data = await Task.findByIdAndUpdate(_id, {
                state
            });
        } else {
            // 单独给当前用户记录属性

            let userInPM = await ProjectMember.getUserInProMember(ppm_userid);

            await TaskStateMember.deleteOne({
                memberid: userInPM,
                taskid: _id,
            });

            data = await TaskStateMember.insertMany([
                {
                    memberid: userInPM,
                    taskid: _id,
                    state,
                }
            ]);
        }

        tdata = resFrame(data);
        res.send(tdata);
    } catch(e) {
        tdata = resFrame('error', '', e);
        res.send(tdata);
    }
});

router.post('/updatedrag', async function (req, res, next) {
    var tdata;

    try {
        const groupArr = req.body,
            {ppm_userid} = req.cookies;

        var level = await User.getLevel(ppm_userid),
            data,
            tasksArr = groupArr.reduce((arr, group) => {
                arr = [
                    ...arr,
                    ...group.task,
                ];

                return arr;
            }, []);

        if (['A', 'M'].includes(level)) {
            // 直接改变task的属性

            // 更新TaskStateMember
            var tsmBwArr = tasksArr.map(item => {
                return {
                    updateMany: {
                        filter: {
                            taskid: Types.ObjectId(item._id),
                            $where: `Number(${item.state}) > Number(this['state'])`,
                        },
                        update: {
                            state: item.state,
                        },
                    }
                }
            });

            await TaskStateMember.bulkWrite(tsmBwArr);

            // 更新task状态
            await Task.updateState(tasksArr);
            
            // 更新task-grout中的顺序及分组
            data = TaskGroup.updateTaskId(groupArr);
        } else {
            // 单独给当前用户记录属性

            let userInPM = await ProjectMember.getUserInProMember(ppm_userid);

            await TaskStateMember.deleteMany({
                memberid: userInPM,
                taskid: tasksArr.map(item => item._id),
            });

            let insertArr = tasksArr.map(item => {
                return {
                    memberid: userInPM,
                    taskid: item._id,
                    state: item.state,
                }
            });

            data = await TaskStateMember.insertMany(insertArr);
        }

        // 更新order-group表
        await OrderGroup.updateOrder(ppm_userid, 'task', tasksArr);

        tdata = resFrame(data);
        res.send(tdata);
    } catch(e) {
        tdata = resFrame('error', '', e);
        res.send(tdata);
    }
});

router.get('/member', async function (req, res, next) {
    var tdata;

    try {
        const {taskcode} = req.query,
            {ppm_userid} = req.cookies;

        var taskData,
            member,
            level = await User.getLevel(ppm_userid);

        if (!['A', 'M'].includes(level)) {
            // 普通成员，仅显示本人

            let userInPM = await ProjectMember.getUserInProMember(ppm_userid);

            member = [userInPM];
        } else {
            taskData = await Task.getRow(taskcode);
            member = taskData.member;
        }
        
        tdata = resFrame(member);
        res.send(tdata);
    } catch(e) {
        tdata = resFrame('error', '', e);
        res.send(tdata);
    }
});

// 归档操作
router.post('/file', function (req, res, next) {
    const taskArr = req.body,
        {ppm_userid} = req.cookies;

    var updatedGroupData;

    new Chain().link(next => {

        var bulkWriteSearch = taskArr.map(item => {
            return {
                updateOne: {
                    filter: {
                        _id: item._id,
                    },
                    update: {
                        state: '4',
                        filetime: app.getTime(),
                    },
                },
            };
        });

        Task.bulkWrite(bulkWriteSearch, (err, data) => {
            if (err) {
                tdata = resFrame('error', '', err);
                res.send(tdata);
                return false;
            }
    
            next();
        });
    }).link(next => {
        TaskGroup.updateTask(taskArr, (err, data) => {
            if (err) {
                tdata = resFrame('error', '', err);
                res.send(tdata);
                return false;
            }

            updatedGroupData = data;
    
            next();
        });
    }).link(next => {
        tdata = resFrame(updatedGroupData);
        res.send(tdata);
    }).run();
});

// 获取时间轴数据
router.get('/timeline', async function (req, res, next) {
    var tdata;

    try {
        const {procode} = req.query,
            {ppm_userid} = req.cookies;
        
        var taskData = await Task.getList({
                procode,
                $where: `this.state !== '4' && this.starttime`,
            }, {}),
            groupData = await TaskGroup.find({
                procode
            });

        tdata = resFrame({
            data: taskData,
            group: groupData,
        });
        res.send(tdata);
    } catch(e) {
        tdata = resFrame('error', '', e);
        res.send(tdata);
    }
});

module.exports = router;
