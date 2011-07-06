/**
 * @author QLeelulu@gmail.com
 * @blog http://qleelulu.cnblogs.com
 */
 
var productsModel = require('../models/products');

exports.index = function(fnNext){
    var _t = this,
        r = {};
        pagesize = 50,
        page = this.routeData.args.id || 1;
        
    var combo = new Combo(function(){
        fnNext( _t.ar.view(r) );
    });
    
    combo.add();
    productsModel.getProducts(page, pagesize, function(err, products){
        r.products = products;
        combo.finishOne();
    });
    
};

exports.category = function(fnNext){
    var _t = this,
        r = {};
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

exports.nocopy = function(fnNext){
    var _t = this,
        r = {};
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
