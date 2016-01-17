//退出登陆

module.exports = {
    get: function (req) {
        req.session.user = null;
        jtool.send({
            status: 200
        });
    }
};
