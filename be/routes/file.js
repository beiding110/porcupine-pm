var express = require('express'),
    router = express.Router(),
    path = require('path'),
    formidable = require('formidable').default,
    app = require('../utils/app.js');

const resFrame = require('../utils/resFrame.js');

router.post('/upload', async function (req, res, next) {
    var tdata;

    try {
        var folderName = app.timePattern(new Date(), 'yyyyMMdd'), // 按日期创建文件夹
            proxyTarget = `/upload/${folderName}`, // 文件存储路径
            uploadDir = path.join(__dirname, '../', proxyTarget), // 硬盘路径
            form = formidable({
                uploadDir,
                keepExtensions: true,
                createDirsFromUploads: true,
            });

        form.parse(req, (err, fields, files) => {
            if (err) {
                tdata = resFrame('error', '', err);

                res.send(tdata);

                return false;
            }

            var filename = files.file[0].newFilename;

            tdata = resFrame({
                name: filename,
                url: `${proxyTarget}/${filename}`,
            });

            res.send(tdata);
        });
    } catch (e) {
        tdata = resFrame('error', '', e.message);
        res.send(tdata);
    }
});

module.exports = router;
