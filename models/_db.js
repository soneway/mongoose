var mongoose = require('mongoose');

var db = mongoose.createConnection('mongodb://127.0.0.1:27017/mongoose');

db.on('error', function (err) {
    console.log(err);
});

module.exports = db;
