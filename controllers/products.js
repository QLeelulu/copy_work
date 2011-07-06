/**
 * @author QLeelulu@gmail.com
 * @blog http://qleelulu.cnblogs.com
 */
 
var productsModel = require('../models/products'),
    commentModel = require('../models/comments'),
    productForm = require('../forms/products').productForm,
    userModel = require('../models/user'),
    userAuthFilter = require('../filters/auth').userAuthFilter;

exports.show = function(fnNext){
    var _t = this,
        productId = this.routeData.args.param;
    productsModel.findById(productId, function(err, product){
        if(!product){
            return fnNext( _t.ar.notFound() );
        }else{
            var r = {product: product}
            fnNext( _t.ar.view(r) );
        }
    });
};


/************
 * 显示添加原创产品页面
 */
exports.add = function(fnNext){
    fnNext( this.ar.view() );
};
exports.add.filters = [userAuthFilter];

/************
 * 添加原创产品并保存到数据库
 */
exports.add_post = function(fnNext){
    var r = {}, 
        _t = this, 
        product = new productForm(_t.req.post);
        
    if(!product.isValid()){
        r.error = product.validErrors;
        return fnNext( this.ar.raw(JSON.stringify(r), 'text/html;charset=UTF-8') );
    }
    product = product.fieldDatas();
    if(product.online_at){
        product.online_at = new Date(product.online_at);
    }
    product.add_by = _t.req.user;
    if(product.category){
    	product.category = product.category.toLowerCase();
    }
    // 图片
    if(product.pics){
        console.log(product.pics)
        var pics = product.pics.replace(/\r\n/g, '\n');
        pics = pics.split('\n');
        product.pics = [];
        var url;
        for(var i=0; i<pics.length; i++){
            url = pics[i].trim();
            if(url){
                product.pics.push(url);
            }
        }
    }else{
        product.pics = [];
    }
    var now = new Date();
    product.created_at = product.updated_at = now;
    productsModel.insert(product, {safe:true}, function(err, _product){
        if(!err && _product && _product.length){
            r.success = true;
            r.product = _product[0];
        }else{
            err && console.log(err);
            r.error = '插入数据失败';
        }
        fnNext( _t.ar.json(r) );
    });
};
exports.add_post.filters = [userAuthFilter];


/************
 * 显示添加山寨产品页面
 */
exports.add_copy = function(fnNext){
    var _t = this, 
        pid = this.routeData.args.param || '';
    productsModel.findById(pid, function(err, product){
        var r = {product: product}
        fnNext( _t.ar.view(r) );
    });
};
exports.add_copy.filters = [userAuthFilter];

/************
 * 添加山寨产品
 */
exports.add_copy_post = function(fnNext){
    var r = {}, 
        _t = this, 
        product = new productForm(_t.req.post);
        
    if(!_t.req.post.product_id){
        r.error = '参数错误';
        return fnNext( this.ar.json(r) );
    }
    if(!product.isValid()){
        r.error = product.validErrors;
        return fnNext( this.ar.json(r) );
    }
    product = product.fieldDatas();
    if(product.online_at){
        product.online_at = new Date(product.online_at);
    }
    product.add_by = _t.req.user;
    // 图片
    if(product.pics){
        console.log(product.pics)
        var pics = product.pics.replace(/\r\n/g, '\n');
        pics = pics.split('\n');
        product.pics = [];
        var url;
        for(var i=0; i<pics.length; i++){
            url = pics[i].trim();
            if(url){
                product.pics.push(url);
            }
        }
    }else{
        product.pics = [];
    }
    var now = new Date();
    product.created_at = product.updated_at = now;
    
    console.log(_t.req.post.product_id)
    productsModel.updateById(_t.req.post.product_id, 
        {$set: {'updated_at': new Date()}, $addToSet: {'copys': product} },  
        {safe:true}, 
        function(err, counts){
            if(!err && counts){
                r.success = true;
            }else{
                err && console.log(err);
                r.error = '插入数据失败';
            }
            fnNext( _t.ar.json(r) );
        }
    );
};
exports.add_copy_post.filters = [userAuthFilter];

/*********
 * 评论列表
 */
exports.comments = function(fnNext){
    var _t = this, product_id = _t.req.get.product_id || _t.req.post.product_id;
    if(product_id){
        commentModel.getComments(product_id, function(err,comments){
            fnNext( _t.ar.view({comments: comments}, 'comment/comment_list.html') );
        });
    }else{
        fnNext( _t.ar.raw('参数错误') );
    }
};

/*********
 * 添加评论
 */
exports.comment_post = function(fnNext){
    var _t = this,
        r = {success: false},
        product_id = _t.req.post.product_id,
        content = _t.req.post.content;
    if(product_id && content && content.trim()){
        var comment = {
            user: _t.req.user,
            product_id: commentModel.id(product_id),
            content: content.trim()
        };
        comment.created_at = comment.updated_at = new Date();
        commentModel.insert(comment, 
            function(err, _comment){
                if(err || !_comment || !_comment.length){
                    r.error = '更新数据库失败';
                }else{
                    r.success = true;
                    //更新用户的统计信息
                    productsModel.updateById(product_id,{
                        '$inc': {
                            'comment_count': 1
                        }
                    });
                }
                fnNext( _t.ar.json(r) );
            }
        );
    }else{
        r.error = '参数错误';
        fnNext( _t.ar.json(r) );
    }
};
exports.comment_post.filters = [userAuthFilter];

