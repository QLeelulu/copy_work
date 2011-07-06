/**
 * @author QLeelulu@gmail.com
 * @blog http://qleelulu.cnblogs.com
 */

var config = require('../config'),
    
    userModel = require('../models/user'),
    userAuthFilter = require('../filters/auth').userAuthFilter,
    crypto = require('crypto');

exports.register = function(fnNext){
    if(this.req.user){
        fnNext( this.ar.redirect('/') );
    }
    
    fnNext( this.ar.view() );
};

exports.register_post = function(fnNext){
    if(this.req.user){
        fnNext( this.ar.redirect('/') );
    }
    
    var r = {}, _t = this;
    if(!this.req.post.username || 
       !this.req.post.password || 
       !this.req.post.password2 || 
       !this.req.post.email ){
        r.error = '请填写完整资料';
        
    }
    if(!r.error && (this.req.post.password !== this.req.post.password2) ){
        r.error = '两次填写的密码不一致';
    }
    if(r.error){
        fnNext( this.ar.json(r) );
        return;
    }
    
    userModel.getByNameOrEmail(this.req.post.username, this.req.post.email, function(err, user){
        if(err){
            r.error = err.message;
        }else if(user){
            if(user.name_lower == this.req.post.username.toLowerCase()){
                r.error = '用户名已经存在';
            }else{
                r.error = 'Email地址已经被注册';
            }
        }
        if(r.error){
            fnNext( _t.ar.json(r) );
            return;
        }
        
        var user = {
            name: _t.req.post.username,
            name_lower: _t.req.post.username.toLowerCase(),
            password: crypto.createHash('md5').update(_t.req.post.password).digest("hex"),
            ticket: crypto.createHash('md5').update( _t.req.post.username + Date.now() ).digest("hex"),
            email:    _t.req.post.email.toLowerCase()
        };
        var now = new Date();
        user.created_time = user.updated_time = now;
        userModel.insert(user, {safe:true}, function(err, _user){
            if(!err && _user && _user.length){
                r.success = true;
            }else{
                err && console.log(err);
                r.error = '插入数据失败';
            }
            fnNext( _t.ar.json(r) );
        });
        
    });
};

exports.login = function(fnNext){
    if(this.req.user){
        fnNext( this.ar.redirect('/') );
    }else{
        fnNext( this.ar.view() );
    }
};

exports.login_post = function(fnNext){
    if(this.req.user){
        fnNext( this.ar.redirect('/') );
    }
    
    var r = {}, _t = this;
    if(!this.req.post.email || 
       !this.req.post.password ){
        r.error = '请填写邮箱地址和密码';
        
        fnNext( this.ar.json(r) );
        return;
    }
    
    userModel.getByEmail(this.req.post.email, function(err, user){
        if(err){
            r.error = err.message;
        }else if(!user){
            r.error = '用户不存在或者密码错误';
        }else if(crypto.createHash('md5').update(_t.req.post.password).digest("hex") !== user.password ){
            r.error = '用户不存在或者密码错误';
        }
        
        if(r.error){
            r.email = _t.req.post.email;
            fnNext( _t.ar.view( r ) );
        }
         else{
            // 默认票据的过期时间为48小时，cookies的过期时间不设置（浏览器关闭就没了）
            var cookieOptions = {path: '/'}, tNow = Date.now(), expires = tNow + 48 * 60 * 60 * 1000;
            if(_t.req.post.remember_me){
                expires = new Date( tNow + 30 * 24 * 60 * 60 * 1000 ).getTime();
                cookieOptions.expires = expires;
            }
            var ticket = crypto.createHash('md5').update(user.name_lower + tNow).digest("hex") + '_' + expires;
            _t.res.cookies.set(config.USER_COOKIE_NAME, ticket, cookieOptions);
            userModel.updateById( user._id.toString(), 
                {$set: {'last_login': new Date()}, $addToSet: {'tickets': ticket} },  
                {safe:true}, 
                function(err, _user){
                    fnNext( _t.ar.redirect(_t.req.get.return_url || '/') );
                    userModel.delExpireTickets(user._id.toString());
                }
            );
        }
        
        
    });
};

/************
 * 退出
 */
exports.logout = function(fnNext){
    if(this.req.user){
        userModel.updateById(this.req.user._id.toString(), 
            {$pull: {'tickets': this.req.cookies[config.USER_COOKIE_NAME]} });
            
        userModel.delExpireTickets(this.req.user._id.toString());
    }
    this.res.cookies.clear(config.USER_COOKIE_NAME, {path:'/'});
    fnNext( this.ar.redirect('/') );
};



