/**
 * @author QLeelulu@gmail.com
 * @blog http://qleelulu.cnblogs.com
 */

var domainRe = /^https?:\/\/([^\/]+)/i;

exports.getDomain = function(url){
    if(url){
        var m = url.match(domainRe);
        if(m){
            return m[1];
        }
    }
    return '';
};


