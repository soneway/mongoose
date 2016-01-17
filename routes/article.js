//文章

var model = require('../models/article');

//默认查询选项
var dsearch = {
    page    : 1,
    pagesize: 10
};

module.exports = {

    //获取文章
    get: function (req) {
        var body = req.body;

        var id = body._id;
        //查一个
        if (id) {
            return model.findById(id).exec(function (err, doc) {
                jtool.onsave(err, doc);
            });
        }

        //查列表
        var search = jtool.extend({}, dsearch, req.query),
            page = search.page,
            pagesize = search.pagesize;

        //计算总数
        model.count().ne('isdel', 1).exec(function (err, count) {
            if (err) return jtool.onerror(err);

            var query = model.find()
                .ne('isdel', 1)
                .limit(pagesize)
                .skip((page - 1) * pagesize)
                .select('_id title');

            query.exec(function (err, doc) {
                if (err) return jtool.onerror(err);

                jtool.send({
                    status  : 200,
                    page    : page,
                    maxpage : Math.ceil(count / pagesize),
                    sum     : count,
                    pagesize: pagesize,
                    data    : doc
                });
            });
        });
    },

    //添加文章
    post: function (req) {
        var body = req.body,
            user = req.session.user;

        //删掉_id
        delete body._id;

        //添加其他信息
        body._userid = user._id;
        body.author = user.uid;
        body.createtime = new Date;

        model.create(body, function (err, doc) {
            jtool.onsave(err, doc);
        });
    },

    //修改文章
    put: function (req) {
        var body = req.body,
            user = req.session.user;

        var id = body._id;
        //id非空验证
        if (!id) {
            return jtool.send({
                status: 400,
                msg   : 'id不能为空'
            });
        }

        model.findById(id).exec(function (err, doc) {
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

            doc.save(function (err) {
                jtool.onsave(err);
            });
        });
    }
};
