var fs = require('fs');
var path = require('path');

var morgan = require('morgan');
var morganBody = require('morgan-body');
var bodyParser = require('body-parser');

const log = fs.createWriteStream(
    path.join(__dirname, '../logs', 'access.log'),
    {
        flags: 'a+',
    }
);

module.exports = (app) => {
    app.use(bodyParser.json());

    morganBody(app, {
        stream: log,
        noColors: true,
    });
};
