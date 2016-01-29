//工具类

function Jtool(req, res) {
    this.req = req;
    this.res = res;
}

module.exports = Jtool;

//扩展函数
Jtool.prototype.extend = (function () {
    var tmpArray = [],
        forEach = tmpArray.forEach,
        slice = tmpArray.slice;

    return function (obj) {
        //$.extend(obj)
        if (arguments.length === 1) {
            for (var p in obj) {
                this[p] = obj[p];
            }
            return this;
        }

        //$.extend({}, defaults[, obj])
        forEach.call(slice.call(arguments, 1), function (item) {
            for (var p in item) {
                obj[p] = item[p];
            }
        });
        return obj;
    };
})();

//向客户端发送信息函数
Jtool.prototype.send = function (rsInfo) {
    var query = this.req.query;

    //jsonp方式
    if (query && query.callback !== undefined) {
        this.res.send(query.callback + '(' + JSON.stringify(rsInfo) + ')');
    }
    else {
        this.res.send(rsInfo);
    }
};

//向客户端发送信息函数
Jtool.prototype.sendMsg = function (status, msg) {
    this.send({
        status: status,
        msg   : msg
    });
};

//向客户端发送客户端请求错误信息函数
Jtool.prototype.sendError = function (msg) {
    this.send({
        status: 400,
        msg   : msg
    });
};

//向客户端发送数据函数
Jtool.prototype.sendData = function (data) {
    var rsInfo = {
        status: 200
    };
    data && (rsInfo.data = data);
    this.send(rsInfo);
};

//错误处理函数
Jtool.prototype.error = function (err) {
    this.send({
        status: 500,
        msg   : err.message
    });
};

//保存处理函数
Jtool.prototype.onsave = function (err, doc) {
    this.onget(err, {
        _id: doc._id
    });
};

//查询处理函数
Jtool.prototype.onget = function (err, doc) {
    if (err) return error(err);
    this.sendData(doc);
};

//module.exports = function (req, res) {
//    var tmpArray = [],
//        forEach = tmpArray.forEach,
//        slice = tmpArray.slice;
//
//    //扩展函数
//    function extend(obj) {
//        //$.extend(obj)
//        if (arguments.length === 1) {
//            for (var p in obj) {
//                this[p] = obj[p];
//            }
//            return this;
//        }
//
//        //$.extend({}, defaults[, obj])
//        forEach.call(slice.call(arguments, 1), function (item) {
//            for (var p in item) {
//                obj[p] = item[p];
//            }
//        });
//        return obj;
//    }
//
//    //向客户端发送信息函数
//    function send(rsInfo) {
//        var query = req.query;
//
//        //jsonp方式
//        if (query && query.callback !== undefined) {
//            res.send(query.callback + '(' + JSON.stringify(rsInfo) + ')');
//        }
//        else {
//            res.send(rsInfo);
//        }
//    }
//
//    //向客户端发送信息函数
//    function sendMsg(status, msg) {
//        send({
//            status: status,
//            msg   : msg
//        });
//    }
//
//    //向客户端发送客户端请求错误信息函数
//    function sendError(msg) {
//        send({
//            status: 400,
//            msg   : msg
//        });
//    }
//
//    //向客户端发送数据函数
//    function sendData(data) {
//        var rsInfo = {
//            status: 200
//        };
//        data && (rsInfo.data = data);
//        send(rsInfo);
//    }
//
//    //错误处理函数
//    function error(err) {
//        send({
//            status: 500,
//            msg   : err.message
//        });
//    }
//
//    //保存处理函数
//    function onsave(err, doc) {
//        onget(err, {
//            _id: doc._id
//        });
//    }
//
//    //查询处理函数
//    function onget(err, doc) {
//        if (err) return error(err);
//        sendData(doc);
//    }
//
//    return {
//        extend   : extend,
//        send     : send,
//        sendMsg  : sendMsg,
//        sendError: sendError,
//        sendData : sendData,
//        error    : error,
//        onsave   : onsave,
//        onget    : onget
//    };
//};