/**
 * @author QLeelulu@gmail.com
 * @blog http://qleelulu.cnblogs.com
 */

var forms = n2Mvc.forms;

exports.productForm = forms.newForm({
    title:{
        required: true,
        required_msg: '产品名称必填'
    }
  , home_url:{
        required: true,
        required_msg: '产品网址必填',
        re: /^((https|http|ftp|rtsp|mms)?:\/\/)?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?(([0-9]{1,3}.){3}[0-9]{1,3}|([0-9a-z_!~*'()-]+.)*([0-9a-z][0-9a-z-]{0,61})?[0-9a-z].[a-z]{2,6})(:[0-9]{1,4})?((\/?)|(\/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+\/?)$/ig,
        re_msg: '网址格式错误'
    }
  , online_at:{
        required: false
    }
  , category:{
        required: false
    }
  , pics:{
        required: false
    }
  , des:{
        required: false
    }
});


