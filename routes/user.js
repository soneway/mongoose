//用户

var model = require('../models/user');

module.exports = {

    //获取用户信息
    get: function (req) {
        jtool.send({
            status: 200,
            data  : req.session.user
        });
    },

    //编辑用户
    put: function (req) {
        var body = req.body,
            user = req.session.user;

        model.findById(user._id).exec(function (err, doc) {
            if (err) return jtool.onerror(err);

            doc.pwd = body.pwd;
            doc.email = body.email;
            doc.age = body.age;

            doc.save(function (err) {
                jtool.onsave(err);
            });
        });
    },

    //删除用户
    delete: function (req) {
        var body = req.body;

        var id = body._id;
        //id非空验证
        if (!id) {
            return jtool.send({
                status: 400,
                msg   : 'id不能为空'
            });
        }

        model.findByIdAndUpdate(id, {isdel: 1}, function (err) {
            jtool.onsave(err);
        });
    }
};
