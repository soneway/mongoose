//注册

module.exports = function (req, res) {
    var user = require('../user')(req, res);

    return {
        PUT: user.modipwd
    };
};
