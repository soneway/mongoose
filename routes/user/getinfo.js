//登陆信息

module.exports = function (req, res) {
    var user = require('./index.js')(req, res);

    return {
        GET: user.getinfo
    };
};
