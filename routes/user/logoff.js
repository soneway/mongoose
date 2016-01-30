//注销

module.exports = function (req, res) {
    var user = require('./index.js')(req, res);

    return {
        DELETE: user.logoff
    };
};
