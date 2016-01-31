//文章

var model = require('../models/article');

module.exports = function (req, res) {
    var router = require('./_router.js')(model, req, res);

    return {
        //获取文章
        GET: function () {
            var query = req.query;

            //查id
            if (query._id) return router.getById(query._id);

            //查列表
            router.getList({
                pager : query,
                select: '_id title author'
            });
        },

        //添加文章
        POST: function () {
            var body = req.body,
                user = req.session.user;

            //添加其他信息
            body._userid = user._id;
            body.author = user.uid;
            body.createtime = new Date;

            router.add({
                doc: body
            });
        },

        //修改文章
        PUT: function () {
            var body = req.body,
                user = req.session.user;

            //_id非空验证
            if (!body._id) {
                return router.sendError('_id不能为空');
            }

            //查id
            model.findById(body._id).exec(function (err, doc) {
                if (err) return router.error(err);

                //判断作者是否相同(doc._userid需先转成字符串)
                if (!doc || doc._userid + '' !== user._id) {
                    return router.sendError('无权限修改');
                }

                //添加其他信息
                body.updatetime = new Date;

                router.editById({
                    _id : body._id,
                    doc : body,
                    $out: '_userid author createtime'
                });
            });
        },

        //删除文章
        DELETE: function () {
            var body = req.body,
                user = req.session.user;

            //_id非空验证
            if (!body._id) {
                return router.sendError('_id不能为空');
            }

            //查id
            model.findById(body._id).exec(function (err, doc) {
                if (err) return router.error(err);

                //判断作者是否相同(doc._userid需先转成字符串)
                if (!doc || doc._userid + '' !== user._id) {
                    return router.sendError('无权限修改');
                }

                //添加其他信息
                body.updatetime = new Date;

                router.delById(body._id);
            });
        }
    };
};