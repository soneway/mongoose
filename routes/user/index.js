//用户

var model = require('../../models/user');
var Router = require('../_router.js');
var router = new Router(model);
module.exports = router;


//注册
router.post = function (req) {
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
};


//编辑资料
router.put = function (req) {
    var body = req.body,
        user = req.session.user;

    router.editById({
        _id : user._id,
        doc : body,
        $out: 'uid pwd'
    });
};


//登陆
router.login = function (req) {
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
            _id   : doc._id,
            uid   : doc.uid
        });
    });
};

//退出登陆
router.logout = function (req) {
    req.session.user = null;
    jtool.sendData();
};

//获取用户信息
router.getinfo = function (req) {
    jtool.sendData(req.session.user);
};

//修改密码
router.modipwd = function (req) {
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
};


//注销
router.logoff = function (req) {
    var user = req.session.user;

    req.session.user = null;
    model.findByIdAndUpdate(user._id, {status: -2}, jtool.onsave);
};
