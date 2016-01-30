//退出登陆

module.exports = function (req, res) {
    var user = require('./index.js')(req, res);

    return {
        GET: user.logout
    };
};