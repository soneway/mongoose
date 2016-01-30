//用户

var model = require('../../models/user.js');
var Router = require('../_router.js');
var router = new Router(model);

module.exports = function (req, res) {
    var jtool = require('../../jtool.js')(req, res);

    return {
        //注册
        POST: function () {
            var body = req.body;

            //检查用户
            model.findOne({
                uid: body.uid
            }).exec(function (err, doc) {
                if (err) return jtool.error(err);

                //用户名已存在
                if (doc) {
                    return jtool.sendError('用户名已存在');
                }

                //添加用户
                router.add({
                    doc: body
                });
            });
        },

        //编辑资料
        PUT: function () {
            var body = req.body,
                user = req.session.user;

            router.editById({
                _id : user._id,
                doc : body,
                $out: 'uid pwd'
            });
        },

        //登陆
        login: function () {
            var body = req.body;

            model.findOne({
                uid: body.uid
            }).ne('status', -1).exec(function (err, doc) {
                if (err) return jtool.error(err);

                //用户名不存在
                if (!doc) {
                    return jtool.sendError('用户名不存在');
                }

                //密码错误
                if (doc.pwd !== body.pwd) {
                    return jtool.sendError('密码错误');
                }

                //session记录用户
                jtool.sendData(req.session.user = {
                    _id: doc._id,
                    uid: doc.uid
                });
            });
        },

        //退出登陆
        logout: function () {
            jtool.sendData(req.session.user = null);
        },

        //获取用户信息
        getinfo: function () {
            jtool.sendData(req.session.user);
        },

        //修改密码
        modipwd: function () {
            var body = req.body,
                user = req.session.user;

            if (!body.pwd) {
                return jtool.sendError('pwd不能为空');
            }

            model.findById(user._id).exec(function (err, doc) {
                if (err) return jtool.error(err);

                //旧密码不正确
                if (body.oldpwd !== doc.pwd) {
                    return jtool.sendError('旧密码不正确');
                }

                //保存
                doc.pwd = body.pwd;
                doc.save(jtool.onsave);
            });
        },

        //注销
        logoff: function () {
            var user = req.session.user;

            req.session.user = null;
            model.findByIdAndUpdate(user._id, {status: -2}, jtool.onsave);
        }
    };
};
