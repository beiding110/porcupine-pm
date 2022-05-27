const resFrame = require('../utils/resFrame');

module.exports = function (req, res, next) {
    const {ppm_userid} = req.cookies;

    // 未登录
    if (!ppm_userid) {
        var tdata = resFrame('login-index', '', '身份过期，请重新登录');

        res.send(tdata);

        return false;
    }

    next();
}