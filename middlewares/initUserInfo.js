/**
 * @author QLeelulu@gmail.com
 * @blog http://qleelulu.cnblogs.com
 */

var config = require('../config'),
    User = require('../models/user');
    

exports.beginMvcHandler = function(ctx, fnNext){
    var ticket = ctx.req.cookies[ config.USER_COOKIE_NAME ];
    if(ticket){
        User.getByTicket(ticket,function(err, user){
            if(!err){
                ctx.req.user = user;
            }
            return fnNext();
        });
    }else{
        return fnNext();
    }
};

