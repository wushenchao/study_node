//加载第三方库
var request = require('request'), //--->获取页面数据用的 请求
	iconv = require('iconv-lite');  //--->处理编码用的 转码

//要抓取的url
var url = 'http://www.xiaohuar.com/list-1-0.html';
//开始抓取
request.get({
	url : url,
	encoding: null//让body 直接是buffer  -->目的是为了解决乱码
}, function(err, response, body){
	if(!err && response.statusCode == 200){
		var body = iconv.decode(body, 'gb2312');//返回的body 直接就是buffer 了...
		console.log(body);//返回请求页面的HTML
	}else{
		console.log('抓取失败');
	}
});
/*
	总结：
	转码

 */