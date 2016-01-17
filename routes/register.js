//用户注册

var model = require('../models/user');

module.exports = {

    post: function (req) {
        var body = req.body;

        //检查用户
        model.findOne({
            uid: body.uid
        }).exec(function (err, doc) {
            if (err) return jtool.onerror(err);

            if (doc) {
                return jtool.send({
                    status: 400,
                    msg   : '用户已存在'
                });
            }

            //添加用户
            model.create(body, function (err, doc) {
                //session记录用户
                req.session.user = doc;
                jtool.onsave(err, doc);
            });
        });
    }

};
