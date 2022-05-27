var express = require('express');
var router = express.Router();

const resFrame = require('../utils/resFrame');
const app = require('../utils/app');

const GanttData = require('../db/schema/gantt-data');
const GanttLink = require('../db/schema/gantt-link');

const Chain = require('../utils/Chain');

const isLogin = require('../middleware/is-login');
router.use(isLogin);

router.get('/list', function (req, res, next) {
    const {procode} = req.query,
        {ppm_userid} = req.cookies;

    if (!procode) {
        tdata = resFrame('error', '', 'procode必传');

        res.send(tdata);
    }

    var ganttData = {};

    new Chain().link(next => {
        GanttData.find({
            procode,
        }, (err, data) => {
            if (err) {
                tdata = resFrame('error', '', err);
                res.send(tdata);
                return false;
            }
            
            ganttData.data = data;

            next();
        });     
    }).link(next => {
        GanttLink.find({
            procode,
        }, (err, data) => {
            if (err) {
                tdata = resFrame('error', '', err);
                res.send(tdata);
                return false;
            }
    
            ganttData.links = data;

            next();
        });
    }).link(next => {
        tdata = resFrame(ganttData);
        res.send(tdata);
    }).run();
});

router.post('/save', function (req, res, next) {
    const {data: dataArr, links: linksArr, procode} = req.body,
        {ppm_userid} = req.cookies;

    var tdata;

    if (!procode) {
        tdata = resFrame('error', '', 'procode必传');

        res.send(tdata);
    }

    new Chain().link(next => {
        GanttData.deleteMany({
            procode,
        }, (err, data) => {
            if (err) {
                tdata = resFrame('error', '', err);
                res.send(tdata);
                return false;
            }

            next();
        });     
    }).link(next => {
        var createArr = dataArr.reduce((ba, item) => {
            item.procode = procode;
            item.adduser = ppm_userid;
            item.addtime = app.getTime();

            ba.push(item);
    
            return ba;
        }, []);

        GanttData.create(createArr, (err, data) => {
            if (err) {
                tdata = resFrame('error', '', err);
                res.send(tdata);
                return false;
            }

            next();
        });     
    }).link(next => {
        GanttLink.deleteMany({
            procode,
        }, (err, data) => {
            if (err) {
                tdata = resFrame('error', '', err);
                res.send(tdata);
                return false;
            }

            next();
        });
    }).link(next => {
        var createArr = linksArr.reduce((ba, item) => {
            item.procode = procode;
            item.adduser = ppm_userid;
            item.addtime = app.getTime();

            ba.push(item);
    
            return ba;
        }, []);

        GanttLink.create(createArr, (err, data) => {
            if (err) {
                tdata = resFrame('error', '', err);
                res.send(tdata);
                return false;
            }

            next();
        });     
    }).link(next => {
        tdata = resFrame(req.body);
        res.send(tdata);
    }).run();
});

module.exports = router;
