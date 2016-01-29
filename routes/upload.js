//上传

var app = require('../app');
var path = require('path');
var guid = require('guid');
var multer = require('multer');

var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './' + app.get('static') + '/' + file.fieldname + '/');
        },
        filename   : function (req, file, cb) {
            var filename = guid.create() + path.extname(file.originalname);
            cb(null, filename);
        }
    }),
    upload = multer({
        storage: storage
    }).fields([
        {name: 'image', maxCount: 1}
    ]);

var router = {};
module.exports = router;


//上传文件
router.post = function (req, res) {
    upload(req, res, function (err) {
        if (err) return jtool.error(err);
        jtool.sendData(req.files);
    });
};