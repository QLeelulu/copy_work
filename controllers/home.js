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
