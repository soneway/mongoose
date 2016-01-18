//Rotuer类
function Router(model) {
    this.model = model;
}


//查id
Router.prototype.getById = function (_id, select) {
    var model = this.model;
    model.findById(_id).select(select).exec(jtool.onsave);
};


//查列表
Router.prototype.getList = (function () {

    //默认查询选项
    var dsearch = {
        page    : 1,
        pagesize: 10
    };

    return function (query, select, condition, sort) {
        var model = this.model;

        //查询参数
        var search = jtool.extend({}, dsearch, query),
            page = +search.page,
            pagesize = +search.pagesize;

        //计算总数
        model.count().ne('isdel', 1).exec(function (err, count) {
            if (err) return jtool.onerror(err);

            var query = model.find(condition)
                .ne('isdel', 1)
                .limit(pagesize)
                .skip((page - 1) * pagesize);

            //select
            select && query.select(select);
            //sort
            sort && select.sort(sort);

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

})();


//删除
Router.prototype.delete = function (req) {
    var model = this.model,
        query = req.query;

    var _id = query._id;
    //id非空验证
    if (!_id) {
        return jtool.send({
            status: 400,
            msg   : 'id不能为空'
        });
    }

    model.findByIdAndUpdate(_id, {isdel: 1}, jtool.onsave);
};


module.exports = Router;
