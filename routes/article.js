//文章

var model = require('../models/article');
var Router = require('./_router.js');
var router = new Router(model);
module.exports = router;


//获取文章
router.get = function (req) {
    var query = req.query;

    //查id
    if (query._id) return router.getById(query._id);

    //查列表
    router.getList({
        query : query,
        select: '_id title author'
    });
};


//添加文章
router.post = function (req) {
    var body = req.body,
        user = req.session.user;

    //添加其他信息
    body._userid = user._id;
    body.author = user.uid;
    body.createtime = new Date;

    router.add({
        doc: body
    });
};


//修改文章
router.put = function (req) {
    var body = req.body,
        user = req.session.user;

    //判断是否是相同作者
    model.findById(body._id).exec(function (err, doc) {
        if (err) return jtool.onerror(err);

        if (doc._userid !== user._id) {
            return jtool.send({
                status: 400,
                msg   : '无权限修改'
            });
        }

        //添加其他信息
        body.updatetime = new Date;

        router.editById({
            _id: body._id,
            doc: body
        });
    });
};