//Rotuer类
function Router(model) {
    this.model = model;
}

//id非空错误处理函数
function idError() {
    jtool.send({
        status: 400,
        msg   : 'id不能为空'
    });
}

//默认排除项
var $dout = ['_id isdel'];
//field过滤函数
function filterField(body, $out, $in) {
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
}


//查id
Router.prototype.getById = function (_id, select) {
    var model = this.model;

    //id非空验证
    if (!_id) return idError();

    model.findById(_id).select(select).exec(jtool.onsave);
};

//默认查询参数
var dquery = {
    page    : 1,
    pagesize: 10
};
//查列表
Router.prototype.getList = function (opts) {
    var model = this.model;
    opts || (opts = {});

    //查询参数
    var query = jtool.extend({}, dquery, opts.query),
        page = +query.page,
        pagesize = +query.pagesize;

    //计算总数
    model.count().ne('isdel', 1).exec(function (err, count) {
        if (err) return jtool.onerror(err);

        var query = model.find(opts.condition)
            .ne('isdel', 1)
            .limit(pagesize)
            .skip((page - 1) * pagesize);

        //select
        opts.select && query.select(opts.select);
        //sort
        opts.sort && select.sort(opts.sort);

        query.exec(function (err, doc) {
            if (err) return jtool.onerror(err);

            jtool.send({
                status  : 200,
                page    : page,
                maxpage : Math.ceil(count / pagesize),
                count   : count,
                pagesize: pagesize,
                data    : doc
            });
        });
    });
};


//添加
Router.prototype.add = function (opts) {
    var model = this.model;
    opts || (opts = {});

    //添加
    model.create(filterField(opts.doc, opts.$out, opts.$in), jtool.onsave);
};


//id更新
Router.prototype.editById = function (opts) {
    var model = this.model;
    opts || (opts = {});

    //id非空验证
    if (!opts._id) return idError();

    //更新
    model.findByIdAndUpdate(opts._id, filterField(opts.doc, opts.$out, opts.$in), jtool.onsave);
};

//列表更新
Router.prototype.editList = function (opts) {
    var model = this.model;
    opts || (opts = {});

    //更新
    model.update(opts.condition, filterField(opts.doc, opts.$out, opts.$in), jtool.onsave);
};


//id删除
Router.prototype.removeById = function (_id) {
    var model = this.model;

    //id非空验证
    if (!_id) return idError();

    //更新
    model.findByIdAndUpdate(_id, {isdel: 1}, jtool.onsave);
};

//列表删除
Router.prototype.removeList = function (condition) {
    var model = this.model;

    //更新
    model.findAndUpdate(condition, {isdel: 1}, jtool.onsave);
};


module.exports = Router;
