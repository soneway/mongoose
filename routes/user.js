//用户

var model = require('../models/user');
var Router = require('./_router.js');
var router = new Router(model);

//添加用户
router.post = function (req) {
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
};

//编辑用户
router.put = function (req) {
    var body = req.body,
        user = req.session.user;

    model.findById(user._id).exec(function (err, doc) {
        if (err) return jtool.onerror(err);

        //验证原密码
        if (body.old_pwd !== doc.pwd) {
            return jtool.send({
                status: 400,
                msg   : '原密码不正确'
            });
        }

        doc.pwd = body.pwd;
        doc.email = body.email;
        doc.age = body.age;

        doc.save(jtool.onsave);
    });
};


//登陆
router.login = function (req) {
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
};

//退出登陆
router.logout = function (req) {
    req.session.user = null;
    jtool.send({
        status: 200
    });
};

//获取用户信息
router.loginfo = function (req) {
    jtool.send({
        status: 200,
        data  : req.session.user
    });
};

module.exports = router;