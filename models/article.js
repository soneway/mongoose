var db = require('./_db');
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


//集合名
var name = 'article';
var schma = new Schema({
    title     : {
        type    : String,
        required: true
    },
    content   : {
        type    : String,
        required: true
    },
    _userid   : {
        type: Schema.Types.ObjectId
    },
    author    : {
        type    : String,
        required: true
    },
    createtime: {
        type: Date
    },
    updatetime: {
        type: Date
    },
    uid       : {
        type: Schema.Types.ObjectId
    },
    isdel     : {
        type   : Number,
        enum   : [0, 1],
        default: 0
    }
});


module.exports = db.model(name, schma, name);