//上传

var multer = require('multer');
var upload = multer({
    dest: './upload/'
}).single('image');
var router = {};
module.exports = router;


//上传文件
router.post = function (req, res) {
    upload(req, res, function (err) {
        if (err) return jtool.error(err);

        jtool.sendData();
    });
};