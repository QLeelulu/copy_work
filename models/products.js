/**
 * @author QLeelulu@gmail.com
 * @blog http://qleelulu.cnblogs.com
 */


/*
    title      : String
  , home_url   : String 产品的url
  , add_by     : String 添加产品的用户
  , des        : String 产品描述
  , category   : String 所属分类
  , online_at  : Date 产品上线时间
  , pics       : ['url', 'url'] 产品图片列表
  , copys      : [{}, {}] 山寨产品列表 
  , created_at : Date
  , updated_at : Date
  , updated_historys: [{},{}] 修改的历史记录
*/

var db = require('./baseModel').db,
    userModel = require('./user'),
    collectionName = 'cp.products';

var Goods = db.collection(collectionName);
    
db.bind(collectionName, {
    /************
     * 获取产品列表
     */
    getProducts: function(page, pagesize, fn){
        var pagesize = Number(pagesize),
            page = Number(page);
        page = (isNaN(page) || page < 1) ? 1 : page;
        pagesize = (isNaN(pagesize) || pagesize < 5) ? 5 : pagesize;
        this.find().skip((page-1)*pagesize).limit(pagesize).sort('online_at', -1).toArray(function(err, products){
            fn && fn(err, products);
        });
    }
  , /************
     * 获取正在出售的商品列表
     */
    addCopy: function(copyProduct, fn){
    }
});

module.exports = Goods;
