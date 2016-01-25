//工具类

module.exports = function (req, res) {
    var tmpArray = [],
        forEach = tmpArray.forEach,
        slice = tmpArray.slice;

    //扩展函数
    function extend(obj) {
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
    }

    //向客户端发送信息函数
    function send(resInfo) {
        var query = req.query;

        //jsonp方式
        if (query && query.callback !== undefined) {
            res.send(query.callback(resInfo));
        }
        else {
            res.send(resInfo);
        }
    }

    //错误处理函数
    function onerror(err) {
        send({
            status: 500,
            msg   : err.message
        });
    }

    //保存处理函数
    function onsave(err, doc) {
        onget(err, {
            _id: doc._id
        });
    }

    //查询处理函数
    function onget(err, doc) {
        if (err) return onerror(err);

        var resInfo = {
            status: 200
        };

        resInfo.data = doc;
        send(resInfo);
    }

    return {
        extend : extend,
        send   : send,
        onerror: onerror,
        onsave : onsave,
        onget  : onget
    };
};