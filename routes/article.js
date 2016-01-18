//文章

var model = require('../models/article');
var Router = require('./_router.js');
var router = new Router(model);

//获取文章
router.get = function (req) {
    var query = req.query;

    var _id = query._id;
    //查单个
    if (_id) {
        return router.getById(_id);
    }

    //查列表
    router.getList(query, '_id title');
};


//添加文章
router.post = function (req) {
    var body = req.body,
        user = req.session.user;

    //删掉_id
    delete body._id;

    //添加其他信息
    body._userid = user._id;
    body.author = user.uid;
    body.createtime = new Date;

    model.create(body, jtool.onsave);
};

//修改文章
router.put = function (req) {
    var body = req.body,
        user = req.session.user;

    var _id = body._id;
    //id非空验证
    if (!_id) {
        return jtool.send({
            status: 400,
            msg   : 'id不能为空'
        });
    }

    model.findById(_id).exec(function (err, doc) {
        if (err) return jtool.onerror(err);

        //判断是否是相同作者
        if (doc._userid !== user._id) {
            return jtool.send({
                status: 400,
                msg   : '无权限修改'
            });
        }

        //读取信息
        doc.title = body.title;
        doc.content = body.content;
        doc.updatetime = new Date;

        doc.save(jtool.onsave);
    });
};