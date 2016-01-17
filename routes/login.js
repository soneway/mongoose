//用户登陆

var model = require('../models/user');

module.exports = {

    post: function (req) {
        var body = req.body;

        model.findOne({
            uid: body.uid
        }).ne('isdel', 1).exec(function (err, doc) {
            if (err) return jtool.onerror(err);

            //用户名不存在
            if (!doc) {
                return jtool.send({
                    status: 401,
                    msg   : '用户名不存在'
                });
            }

            //密码错误
            if (doc.pwd !== body.pwd) {
                return jtool.send({
                    status: 401,
                    msg   : '密码错误'
                });
            }

            //session记录用户
            req.session.user = doc;
            jtool.send({
                status: 200,
                data  : doc
            });
        });
    }

};
