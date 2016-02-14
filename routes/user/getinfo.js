//登陆信息

module.exports = function (req, res) {
    var user = require('../user')(req, res);

    return {
        GET: user.getinfo
    };
};
