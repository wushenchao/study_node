// 通过 配置文件和模版  生成plits 和 重命名 表情名称 
require('shelljs/global');
var hbs = require('hbs');
var fs = require('fs');

var confFile = __dirname + '/../conf/Expression.conf'; // 配置文件路径
var plistFile = __dirname + '/../plist/Expression.plist'; // 生成的plist路径
var imageFile = __dirname + '/../Expressions/'; // 表情存放路径
var masterplate = __dirname + '/../plist/masterplate.plist'; // 模版文件路径

// 1. 读表情配置文件
var fileJson = cat(confFile);
var dic = JSON.parse(fileJson);

var array = new Array();
for (var key in dic) {
	var value = dic[key];
	// 模版配置
	var dicArray = {};
	dicArray["Expression"] = value;
	array.push(dicArray);

	// 重命名文件
	var newPath = imageFile +  value + "@2x.png";
	var oldPath = imageFile + key;
	fs.rename(oldPath, newPath);
}

// 2. 获取模版
var master = cat(masterplate);
var template = hbs.compile(master);
var result = template(array);

// 3. 通过模版生成plist
fs.writeFile(plistFile, result, 'utf-8', function callback(error){
	if (error) {
		console.log("creatFileError");
	} else {
		console.log("creatFileSuccess");
	}
});
