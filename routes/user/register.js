//注册

module.exports = function (req, res) {
    var user = require('./index.js')(req, res);

    return {
        POST: user.POST
    };
};
