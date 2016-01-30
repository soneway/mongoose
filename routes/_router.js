//Rotuer类

module.exports = function (model, req, res) {

    //扩展函数
    var extend = (function () {
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

    //field过滤函数
    var filterField = (function () {
        //默认排除项
        var $dout = '_id status';

        return function (body, $out, $in) {
            //默认项排除
            $dout.split(' ').forEach(function (item) {
                delete body[item];
            });

            //排除
            if (typeof $out === 'string') {
                $out.split(' ').forEach(function (item) {
                    delete body[item];
                });
                return body;
            }

            //包含
            if (typeof $in === 'string') {
                var doc = {};
                $in.split(' ').forEach(function (item) {
                    doc[item] = body[item];
                });
                return doc;
            }

            //其他
            return body;
        };
    })();


    //查id
    function getById(_id, select) {
        //id非空验证
        if (!_id) return sendError('_id不能为空');

        model.findById(_id).select(select).exec(onget);
    }

    //查列表
    var getList = (function () {
        //默认分页参数
        var dpager = {
            page    : 1,
            pagesize: 10
        };

        return function (opts) {
            opts || (opts = {});

            //查询参数
            var pager = extend({}, dpager, opts.pager),
                page = +pager.page,
                pagesize = +pager.pagesize;

            //计算总数
            model.count().ne('status', -1).exec(function (err, count) {
                if (err) return error(err);

                var query = model.find(opts.condition)
                    .ne('status', -1)
                    .limit(pagesize)
                    .skip((page - 1) * pagesize);

                //select
                opts.select && query.select(opts.select);
                //sort
                opts.sort && query.sort(opts.sort);

                query.exec(function (err, doc) {
                    if (err) return error(err);

                    sendData({
                        page    : page,
                        maxpage : Math.ceil(count / pagesize),
                        count   : count,
                        pagesize: pagesize,
                        list    : doc
                    });
                });
            });
        };

    })();


    //添加
    function add(opts) {
        opts || (opts = {});

        //添加
        model.create(filterField(opts.doc, opts.$out, opts.$in), onsave);
    }


    //id更新
    function editById(opts) {
        opts || (opts = {});

        //id非空验证
        if (!opts._id) return sendError('_id不能为空');

        //更新
        model.findByIdAndUpdate(opts._id, filterField(opts.doc, opts.$out, opts.$in), onsave);
    }

    //列表更新
    function editList(opts) {
        opts || (opts = {});

        //更新
        model.update(opts.condition, filterField(opts.doc, opts.$out, opts.$in), onsave);
    }


    //id删除
    function delById(_id) {
        //id非空验证
        if (!_id) return sendError('_id不能为空');

        //更新
        model.findByIdAndUpdate(_id, {status: -1}, onsave);
    }

    //列表删除
    function delList(condition) {
        //更新
        model.findAndModify(condition, {status: -1}, onsave);
    }


    //向客户端发送信息函数
    function send(rsInfo) {
        var query = req.query;

        //jsonp方式
        if (query && query.callback !== undefined) {
            res.send(query.callback + '(' + JSON.stringify(rsInfo) + ')');
        }
        else {
            res.send(rsInfo);
        }
    }

    //向客户端发送信息函数
    function sendMsg(status, msg) {
        send({
            status: status,
            msg   : msg
        });
    }

    //向客户端发送客户端请求错误信息函数
    function sendError(msg) {
        send({
            status: 400,
            msg   : msg
        });
    }

    //向客户端发送数据函数
    function sendData(data) {
        var rsInfo = {
            status: 200
        };
        data && (rsInfo.data = data);
        send(rsInfo);
    }

    //错误处理函数
    function error(err) {
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
        if (err) return error(err);
        sendData(doc);
    }

    return {
        extend  : extend,
        getById : getById,
        getList : getList,
        add     : add,
        editById: editById,
        editList: editList,
        delById : delById,
        delList : delList,

        send     : send,
        sendMsg  : sendMsg,
        sendError: sendError,
        sendData : sendData,
        error    : error,
        onsave   : onsave,
        onget    : onget
    };

};

