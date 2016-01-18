var db = require('./_db');
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


//集合名
var name = 'user';
var schma = new Schema({
    uid  : {
        type    : String,
        required: true
    },
    pwd  : {
        type    : String,
        required: true
    },
    age  : {
        type: Number
    },
    email: {
        type: String
    },
    isdel: {
        type   : Number,
        enum   : [0, 1],
        default: 0
    }
});


module.exports = db.model(name, schma, name);