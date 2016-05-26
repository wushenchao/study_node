//加载第三方库
var request = require('request'); //--->获取页面数据用的 请求
var	iconv = require('iconv-lite');  //--->处理编码用的 转码
var	cheerio = require('cheerio'); //--->解析页面用的 用法类似于jquery
var	async = require('async'); //--->异步流程控制
var path = require('path');
var	fs = require('fs');


//要抓取的url
// var url = 'http://www.xiaohuar.com/list-1-0.html';
var count = 0;// 总共22页
var urlList = [];//地址容器
var xiaohuaUrlList = [];//详情容器
//处理抓取的url
for(var i = 0; i <= count; i++){

	urlList.push('http://www.xiaohuar.com/list-1-' + i + '.html');
}
//查看要抓的链接地址
console.log(urlList);
// return;

//注意 request 是异步操作
//async 控制异步操作
async.waterfall([getInfoList, getImageList], function(err){
	console.log('爬虫结束');
});

//根据地址容器获取详情页
function getInfoList(done){
	async.forEachLimit(urlList, 10, function(item, callback){
		//开始抓取
		request.get({
			url : item,
			encoding: null//让body 直接是buffer  -->目的是为了解决
		}, function(err, response, body){
			if(!err && response.statusCode == 200){
				var body = iconv.decode(body, 'gb2312');//返回的body 直接就是buffer 了...
				//解析页面
				var $ = cheerio.load(body);
				//拿到此页面的链接
				$('#list_img').find('.item').each(function(i){
					var xiaohuaUrl = $(this).find('a').attr('href');
					console.log(xiaohuaUrl);//打印这个页面要抓取的url地址

					/*
						经过抓取 发现格式不统一

						/p-1-146.html
						http://www.xiaohuar.com/p-1-584.html
							
						有这两种 那么就让他统一一下吧
					 */
					xiaohuaUrl = xiaohuaUrl.replace('http://www.xiaohuar.com', '');
					//放入到容器里 准备用来抓取详情页的图片数据
					xiaohuaUrlList.push(xiaohuaUrl);
				});
				callback();
			}else{
				console.log('抓取失败');
				callback();
			}
		});
	}, function(err){
		if(err){
			console.log('获取详情列表页失败');
			done();
		}else{
			console.log('获取详情列表页结束');
			console.log(xiaohuaUrlList);
			done();
		}
	});
}


//根据详情页容器获取内容
function getImageList(done){
	var rep = /<img src=\'([^\']*?)\'>/img
	async.forEachLimit(xiaohuaUrlList, 10, function(item, callback){
		//开始抓取
		request.get({
			url : 'http://www.xiaohuar.com' + item,
			encoding: null//让body 直接是buffer  -->目的是为了解决
		}, function(err, response, body){
			if(!err && response.statusCode == 200){
				var body = iconv.decode(body, 'gb2312');//返回的body 直接就是buffer 了...
				//解析页面
				var $ = cheerio.load(body);
				//获取页面内容
				var html = $('.photo-Middle script').text();
				//正则获取图片链接
				// console.log(html);
				var photosr = html.match(/src=\\\'[\/\.\w]+\\\'/img);
				console.log(photosr);
				//下载图片
				async.forEach(photosr, function(obj, cb){
					var imgsrc = obj.replace('src=\\\'', 'http://www.xiaohuar.com').replace('\\\'', '');
					var filename = parseUrlForFileName(imgsrc); 
					downloadImg(imgsrc,filename,function(){
						console.log(filename + ' done');
						cb();
					});
				}, function(){
					console.log('某个妹子图片下载处理结束');
					callback();
				});
			}else{
				console.log('抓取失败');
				callback();
			}
		});
	}, function(err, result){
		if(err){
			console.log('获取图片链接失败');
			done();
		}else{
			console.log('获取图片链接结束');
			done();
		}
	});
}

//生成文件名
function parseUrlForFileName(address) {
	var filename = path.basename(address);
	return filename;
}
//下载图片
function downloadImg(_url, filename, callback){
	request.head(_url, function(err, res, body){
		console.log('content-type:', res.headers['content-type']);  //这里返回图片的类型
		console.log('content-length:', res.headers['content-length']);  //图片大小
		if(err){
			console.log('err: ' + err);
			return false;
		}
		console.log('res: '+ res);
		//调用request的管道来下载到 images文件夹下
		request(_url)
			.pipe(fs.createWriteStream('images/' + filename))
			.on('close', callback);  
	});
};


/*
	总结：
	下载图片

	现在我们有了图片的地址和图片的名字 就可以下载了 
	在这里我们调用的是request模块的head方法来下载 
	请求到图片再调用fs文件系统模块中的createWriteStream来下载到本地目录

 */