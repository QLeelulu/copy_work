/**
 * @author QLeelulu@gmail.com
 * @blog http://qleelulu.cnblogs.com
 */

exports.DEBUG = true;

exports.projectDir = __dirname;

exports.staticFileDir = 'static';

/*******
 * Cookies
 */
exports.USER_COOKIE_NAME = 'ttest';

/*******
 * DATABASE
 */
exports.MONGO_HOST = 'localhost';
exports.MONGO_PORT = 27017;
exports.MONGO_DB_NAME = 'copy_works';
exports.MONGO_DB_USER = 'root';
exports.MONGO_DB_PWD = '123456';

exports.middlewares = [
    'cookie',
    'multipart',
    'initUserInfo',
];

exports.init = function(){
    this.route.static('^/favicon.ico');
    this.route.static('^/static/(.*)');
    
    
	this.route.map(
        'cateRoute',
        '/c/{cate}/',
        {controller:'home', action:'category'}
    );
    
    this.route.map(
        'waitingRoute',
        '/t/waiting/',
        {controller:'home', action:'nocopy'}
    );
    
    this.route.map(
        'dailyRoute',
        '/t/daily/',
        {controller:'home', action:'daily'}
    );
    
    this.route.map(
        'idRoute',
        '/{controller}/{action}/{id}/',
        {controller:'home', action:'index'},
        {id:'\\d+'}
    );
    
    this.route.map(
        'default',
        '/{controller}/{action}/{param}',
        {controller:'home', action:'index', param: null}
    );
};