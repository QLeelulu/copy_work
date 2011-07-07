/**
 * @author QLeelulu@gmail.com
 * @blog http://qleelulu.cnblogs.com
 */
 
var userModel = require('../models/user'),
    adminAuthFilter = require('../filters/auth').adminAuthFilter;

// Controller的验证filter
exports.filters = [adminAuthFilter]

exports.index = function(fnNext){
    var _t = this, r = {}, 
        now = new Date(),
        year = now.getFullYear(),
        month = now.getMonth(),
        day = now.getDate(),
        today = new Date(year, month, day),
        yestoday = new Date(year, month, day-1);
    
    var combo = new Combo(function(){
        fnNext( _t.ar.view(r) );
    });
    
    
    //总用户数
    combo.add();
    userModel.count(function(err, count){
        r.users_count = count;
        combo.finishOne();
    });
    
    
    
};

_addActions(require('./admin_users'));
_addActions(require('./admin_products'));
_addActions(require('./admin_comments'));

function _addActions(actions){
    for(var k in actions){
        exports[k] = actions[k];
    }
};