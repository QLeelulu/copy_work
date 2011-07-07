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

/*********
 * 处理简介里面的部分内容为html
 */
exports.desTextToHtml = function(text){
	text = text || '';
	text = text.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br/>');
    text = exports.replaceTextUrlToHtml(text);
    return text;
};


/********
 * 替换文本中url为html代码a标签
 */
var URL_RE = new RegExp('(?:\\[url\\s*=\\s*|)((?:www\\.|http[s]?://)[\\w\\.\\?%&\\-/#=;:!\\+~]+)(?:\\](.+)\\[/url\\]|)', 'ig');
exports.replaceTextUrlToHtml = function(text){
    if(text){
        return text.replace(URL_RE, _replaceUrl);
    }
    return '';
};
function _replaceUrl(m, g1, g2){
    var _url = g1;
    if(g1.indexOf('http') != 0){
        _url = 'http://' + g1;
    }
    return '<a target="_blank" class="link" href="' + _url + '">' + (g2||g1) + '</a>';
};
