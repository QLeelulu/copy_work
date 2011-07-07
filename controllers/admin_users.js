/**
 * @author QLeelulu@gmail.com
 * @blog http://qleelulu.cnblogs.com
 */
 
var fs = require('fs'),
    path = require('path'),
    util = require('util'),
    commonUtil = require('../util/common_util'),
    userModel = require('../models/user');

/******
 * 人数应该不会很多吧，直接不分页了
 */
exports.users = function(fnNext){
    var _t = this,
        r = {},
        pagesize = 50,
        page = this.routeData.args.id || 1;
    
    var combo = new Combo(function(){
        fnNext( _t.ar.view({'users': r.users}) );
    });
    
    combo.add();
    userModel.find().sort('created_at', -1).toArray(function(err, users){
        r.users = users;
        combo.finishOne();
    });
};


/********
 * 查看用户的详细信息
 */
exports.user_detail = function(fnNext){
    var _t = this,
        userId = this.routeData.args.param;
    userModel.findById(userId, function(err, user){
        return fnNext( _t.ar.view({user: user}) );
    });
};

/*******
 * 管理员管理
 */
exports.admin_users = function(fnNext){
    var _t = this;
    userModel.find({isAdmin:true}).toArray(function(err, users){
        fnNext( _t.ar.view({'users': users}) );
    });
};

/*******
 * 添加管理员
 */
exports.admin_user_add = function(fnNext){
    var _t = this, username = _t.req.post.username, r = {success:false};
    if(!username){
        r.error = '参数错误';
        return fnNext( _t.ar.json(r) );
    }
    
    userModel.getByName(username, function(err, user){
        if(err || !user){
            r.error = (err && err.message) || '用户不存在';
            return fnNext( _t.ar.json(r) );
        }
        userModel.updateById(user._id.toString(), {$set:{isAdmin:true}}, {safe:true}, function(err, counts){
            if(err || !counts){
                r.error = '更新数据库失败';
            }else{
                r.success = true;
            }
            return fnNext( _t.ar.json(r) );
        });
    });
};

/*******
 * 取消管理员
 */
exports.admin_user_remove = function(fnNext){
    var _t = this, user_id = _t.req.post.user_id, r = {success:false};
    if(!user_id){
        r.error = '参数错误';
        return fnNext( _t.ar.json(r) );
    }
    userModel.updateById(user_id, {$set:{isAdmin:false}}, {safe:true}, function(err, counts){
        if(err || !counts){
            r.error = '更新数据库失败'; //err.message;
        }else{
            r.success = true;
        }
        return fnNext( _t.ar.json(r) );
    });
};
