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

module.exports = function (req, res) {
    var util = require('./_util')(null, req, res);

    return {
        //上传文件
        POST: function () {
            upload(req, res, function (err) {
                if (err) return util.error(err);
                util.sendData(req.files);
            });
        }
    };
};