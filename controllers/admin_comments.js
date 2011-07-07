/**
 * @author QLeelulu@gmail.com
 * @blog http://qleelulu.cnblogs.com
 */
 
var productsModel = require('../models/products'),
	commentModel = require('../models/comments');

exports.comments = function(fnNext){
    var _t = this,
        pagesize = 50,
        page = this.routeData.args.id || 1;
    commentModel.getByPage(page, pagesize, function(err, comments){
        fnNext( _t.ar.view({'comments': comments}) );
    });
};

exports.comment_del = function(fnNext){
    var _t = this,
    	r = {success:false},
        comment_id = this.req.post.comment_id,
        product_id = this.req.post.product_id;
    if(comment_id){
	    commentModel.removeById(comment_id, {safe:true}, function(err, reply){
	    	if(!err && reply){
	    		//更新评论数
                productsModel.updateById(product_id,{
                    '$inc': {
                        'comment_count': -1
                    }
                });
	    		r.success = true;
	    	}else{
	    		r.error = '删除失败';
	    	}
	        fnNext( _t.ar.json(r) );
	    });
    }else{
    	r.error = '参数错误';
    	fnNext( _t.ar.json(r) );
    }
};
