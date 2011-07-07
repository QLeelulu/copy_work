/**
 * @author QLeelulu@gmail.com
 * @blog http://qleelulu.cnblogs.com
 */
 
var commentModel = require('../models/comments');

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
        comment_id = this.req.post.comment_id;
    if(comment_id){
	    commentModel.removeById(comment_id, {safe:true}, function(err, reply){
	    	console.log(err)
	    	console.log(reply)
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
