var db = require('./_db');
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


//集合名
var name = 'user';
var schma = new Schema({
    uid    : {
        type    : String,
        required: true
    },
    pwd    : {
        type    : String,
        required: true
    },
    age    : {
        type: Number
    },
    email  : {
        type: String
    },
    //记录状态,0为默认,-1为删除,-2为已注销,1为管理员
    status  : {
        type   : Number,
        default: 0
    }
});


module.exports = db.model(name, schma, name);