var express = require('express');
var app = express();


//解析ajax请求的application/x-www-form-urlencoded数据,不然req.body无法获取
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

//session
var session = require('express-session');
app.use(session({
    secret           : 'express',
    key              : 'express',
    resave           : true,
    saveUninitialized: true,
    cookie           : {
        maxAge: (1000 * 60 * 60) * 24
    }
}));


//需要登陆拦截的path
var loginPaths = ['/user/getinfo', '/user'],
//不要登陆拦截的path
    nologinPaths = ['/user/login', '/user/register'];
//登陆拦截
app.use('/*', function (req, res, next) {
    //初始化jtool
    global.jtool = require('./jtool.js')(req, res);

    //请求路径
    var path = req.baseUrl;

    //不需要登陆拦截的
    if (nologinPaths.indexOf(path) !== -1) {
        return next();
    }

    //需要登陆拦截的,其他默认为不是get都拦截下
    if (loginPaths.indexOf(path) !== -1 || req.method !== 'GET') {
        if (!req.session.user) {
            return jtool.sendMsg(401, '未登陆');
        }
    }
    next();
});


//路径响应
app.use('/*', function (req, res) {
    //预防未知路径
    var router;
    try {
        router = require('./routes' + req.baseUrl);
    }
    catch (err) {
        return jtool.sendMsg(404, err.message);
    }

    //请求响应函数
    var cb = router[req.method.toLowerCase()];
    //未知的method
    if (typeof cb !== 'function') {
        return jtool.sendMsg(404, '未知方法');
    }
    cb(req, res);
});


app.listen(3000);

module.exports = app;