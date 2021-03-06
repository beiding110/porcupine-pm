var express = require('express');
var router = express.Router();

const resFrame = require('../utils/resFrame');
const app = require('../utils/app');
const Chain = require('../utils/Chain');

const Task = require('../db/schema/task');
const TaskGroup = require('../db/schema/task-group');
const Project = require('../db/schema/project');

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

router.get('/list-state', function (req, res, next) {
    const {procode} = req.query,
        {ppm_userid} = req.cookies;

    var taskData;

    new Chain().link(next => {
        if (!procode) {
            // 没有procode，按人查
            Project.getUsersPro(ppm_userid, false, (err, data) => {
                if (err) {
                    tdata = resFrame('error', '', err);
                    res.send(tdata);
                    return false;
                }

                Task.getList({
                    procode: {
                        $in: data.map(item => item._id),
                    },
                    state: {
                        $ne: '4',
                    },
                }, {}, (err, data) => {
                    if (err) {
                        tdata = resFrame('error', '', err);
                        res.send(tdata);
                        return false;
                    }
        
                    taskData = data;
        
                    next();
                });
            });
        } else {
            // 有procode，按项目查
            Task.getList({
                procode,
                state: {
                    $ne: '4',
                },
            }, {}, (err, data) => {
                if (err) {
                    tdata = resFrame('error', '', err);
                    res.send(tdata);
                    return false;
                }
    
                taskData = data;
        
                next();
            });
        }
    }).link(next => {
        var tasks = taskData,
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
    }).run();
});

router.get('/list-file', function (req, res, next) {
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
            $gte: starttime,
            $lte: endtime,
        };
    }

    var taskData;

    new Chain().link(next => {
        if (!procode) {
            // 没有procode，按人查
            Project.getUsersPro(ppm_userid, true, (err, data) => {
                if (err) {
                    tdata = resFrame('error', '', err);
                    res.send(tdata);
                    return false;
                }

                Task.getList({
                    procode: {
                        $in: data.map(item => item._id),
                    },
                    ...search,
                }, {
                    filetime: -1,
                }, (err, data) => {
                    if (err) {
                        tdata = resFrame('error', '', err);
                        res.send(tdata);
                        return false;
                    }
        
                    taskData = data;
        
                    next();
                });
            });
        } else {
            // 有procode，按项目查
            Task.getList({
                procode,
                ...search,
            }, {
                filetime: -1,
            }, (err, data) => {
                if (err) {
                    tdata = resFrame('error', '', err);
                    res.send(tdata);
                    return false;
                }
    
                taskData = data;
        
                next();
            });
        }
    }).link(next => {
        tdata = resFrame(taskData);
        res.send(tdata);
    }).run();
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

router.get('/detail', function (req, res, next) {
    const {taskcode} = req.query,
        {ppm_userid} = req.cookies;

    var taskData;

    new Chain().link(next => {
        Task.getRow(taskcode, (err, data) => {
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

router.post('/updatestete', function (req, res, next) {
    const {_id, state} = req.body,
        {ppm_userid} = req.cookies;

    var tdata;

    if (!_id) {
        tdata = resFrame('error', '', '请选择要更新的项');

        res.send(tdata);

        return false;
    }

    Task.findByIdAndUpdate(_id, {
        state
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

router.post('/updatedrag', function (req, res, next) {
    const groupArr = req.body,
        {ppm_userid} = req.cookies;

    var tdata;

    new Chain().link(next => {
        Task.updateDrag(groupArr, (err, data) => {
            if (err) {
                tdata = resFrame('error', '', err);
                res.send(tdata);
                return false;
            }

            next();
        });
    }).link(next => {
        TaskGroup.updateTaskId(groupArr, (err, data) => {
            if (err) {
                tdata = resFrame('error', '', err);
                res.send(tdata);
                return false;
            }
    
            tdata = resFrame(data);
            res.send(tdata);
        });
    }).run();
});

router.get('/member', function (req, res, next) {
    const {taskcode} = req.query,
        {ppm_userid} = req.cookies;

    var taskData;

    new Chain().link(next => {
        Task.getRow(taskcode, (err, data) => {
            if (err) {
                tdata = resFrame('error', '', err);
                res.send(tdata);
                return false;
            }

            taskData = data;
    
            next();
        });
    }).link(next => {
        tdata = resFrame(taskData.member);
        res.send(tdata);
    }).run();
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
router.get('/timeline', function (req, res, next) {
    const {procode} = req.query,
        {ppm_userid} = req.cookies;
    
    var taskData,
        groupData;

    new Chain().link(next => {

        Task.getList({
            procode,
            $where: `this.state !== '4' && this.starttime`,
        }, {}, (err, data) => {
            if (err) {
                tdata = resFrame('error', '', err);
                res.send(tdata);
                return false;
            }

            taskData = data;
    
            next();
        });
    }).link(next => {
        TaskGroup.find({
            procode
        }, (err, data) => {
            if (err) {
                tdata = resFrame('error', '', err);
                res.send(tdata);
                return false;
            }

            groupData = data;

            next();
        });
    }).link(next => {
        tdata = resFrame({
            data: taskData,
            group: groupData,
        });
        res.send(tdata);
    }).run();
});

module.exports = router;
