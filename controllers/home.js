/**
 * @author QLeelulu@gmail.com
 * @blog http://qleelulu.cnblogs.com
 */
 
var productsModel = require('../models/products');

exports.index = function(fnNext){
    var _t = this,
        r = {},
        pagesize = 100,
        page = this.routeData.args.id || 1;
        
    page = Number(page);
    page = (isNaN(page) || page < 1) ? 1 : page;
    pagesize = (isNaN(pagesize) || pagesize < 50) ? 50 : pagesize;
        
    var combo = new Combo(function(){
        fnNext( _t.ar.view(r) );
    });
    
    combo.add();
    productsModel.getProducts(page, pagesize, function(err, products){
        r.products = products;
        combo.finishOne();
    });
    productsModel.find({'category':'internet'}).skip((page-1)*pagesize).limit(pagesize).sort('online_at', -1).toArray(function(err, products){
        r.products = products;
        combo.finishOne();
    });
    
};

exports.category = function(fnNext){
    var _t = this,
        r = {},
        pagesize = 50,
        page = this.req.get.page || 1,
        category = this.routeData.args.cate;
        
    var combo = new Combo(function(){
        fnNext( _t.ar.view(r, 'home/index.html') );
    });
    
    combo.add();
    productsModel.getProductsByCategory(category, page, pagesize, function(err, products){
        r.products = products;
        combo.finishOne();
    });
    
};

/**********
 * 日常产品类的山寨产品
 */
exports.daily = function(fnNext){
    var _t = this,
        r = {};
        
    var combo = new Combo(function(){
        fnNext( _t.ar.view(r, 'home/daily.html') );
    });
    
    combo.add();
    productsModel.find({'category':'daily'}).sort('created_at', -1).toArray(function(err, products){
        r.products = products;
        combo.finishOne();
    });
    
};

exports.nocopy = function(fnNext){
    var _t = this,
        r = {},
        pagesize = 50,
        page = this.req.get.page || 1;
        
    var combo = new Combo(function(){
        fnNext( _t.ar.view(r, 'home/index.html') );
    });
    
    combo.add();
    productsModel.getNoCopyProducts(page, pagesize, function(err, products){
        r.products = products;
        combo.finishOne();
    });
    
};


exports.about = function(fnNext){
    fnNext( this.ar.view() );
};

exports.disclaimer = function(fnNext){
    fnNext( this.ar.view() );
};

exports.partner = function(fnNext){
    fnNext( this.ar.view() );
};

exports.contact = function(fnNext){
    fnNext( this.ar.view() );
};
