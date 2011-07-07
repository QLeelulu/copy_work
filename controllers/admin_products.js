/**
 * @author QLeelulu@gmail.com
 * @blog http://qleelulu.cnblogs.com
 */
 
var productsModel = require('../models/products'),
	commentModel = require('../models/comments');

exports.products = function(fnNext){
    var _t = this,
        pagesize = 50,
        page = this.routeData.args.id || 1;
    productsModel.getAdminProducts(page, pagesize, function(err, products){
        fnNext( _t.ar.view({'products': products}) );
    });
};

exports.product_del = function(fnNext){
    var _t = this,
    	r = {success:false},
        product_id = this.req.post.product_id;
    if(product_id){
	    productsModel.removeById(product_id, {safe:true}, function(err, reply){
	    	if(!err && reply){
	    		// 删错产品的评论
                commentModel.remove({product_id: productsModel.id(product_id)}, function(){});
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

exports.product_copy_del = function(fnNext){
    var _t = this,
    	r = {success:false},
        product_id = this.req.post.product_id,
        //copy_id = this.req.post.copy_id; //木有id，悲催
        created_at = Number(this.req.post.created_at);
        
    if(product_id && created_at && !isNaN(created_at)){
	    productsModel.updateById(product_id,
	    	{$pull: {'copys': {'created_at': new Date(created_at)}} },
	    	{safe:true}, function(err, reply){
	    	if(!err && reply){
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
