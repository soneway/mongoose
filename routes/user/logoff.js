//注销

module.exports = function (req, res) {
    var user = require('../user')(req, res);

    return {
        DELETE: user.logoff
    };
};
