var express = require('express');
var router = express.Router();

const resFrame = require('../utils/resFrame');

const User = require('../db/schema/user');

/* GET users listing. */
router.get('/', function (req, res, next) {
    const query = req.query;

    res.send('respond with a resource');
});

router.post('/login', function (req, res, next) {
    const body = req.body,
        {loginname, pwd} = body;

    var tdata;

    if (!loginname || !pwd) {
        tdata = resFrame('error', '', '用户名密码不能为空');

        res.send(tdata);

        return false;
    }

    User.findOne({
        loginname,
    }, (err, data) => {
        if (err) {
            tdata = resFrame('error', '', err);
            res.send(tdata);
            return false;
        }

        if (!data) {
            tdata = resFrame('error', '', '该用户不存在');
            res.send(tdata);
            return false;
        }
    
        if (data.pwd !== pwd) {
            tdata = resFrame('error', '', '用户名或密码错误');
            res.send(tdata);
            return false;
        }
    
        data.pwd = '';

        res.cookie('ppm_userid', data.id, {
            maxAge: 1000 * 60 * 60 * 24,
        });

        tdata = resFrame(data);
        res.send(tdata)
    });
});

module.exports = router;
