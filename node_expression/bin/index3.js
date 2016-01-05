
// 通过已经配置好的表情名称生成plist文件
require('shelljs/global');
var hbs = require('hbs');
var fs = require('fs');

var plistFile = __dirname + '/../plist/Expression.plist'; // 生成的plist路径
var imageFile = __dirname + '/../Expressions/'; // 表情存放路径
var masterplate = __dirname + '/../plist/masterplate.plist'; // 模版文件路径

// 获取所有表情名称
var fileArray = ls('-R', imageFile);
// console.log(fileArray);

var array = new Array();
for (var key in fileArray) {
	var value = fileArray[key];
	console.log(key);
	console.log(value);

	// 重命名文件
	/*
	if (value.indexOf(".") > 0) {
		var newValue = value.substring(0, value.length - 4);
		var newPath = imageFile + newValue + "@2x.png";
		var oldPath = imageFile + value;
		fs.rename(oldPath, newPath);
	}
	*/
	if (value.indexOf("@2x") > 0) {
		console.log(value);
		var newValue = value.substring(0, value.length - 7);
		// 模版配置
		var dicArray = {};
		dicArray["Expression"] = newValue;
		array.push(dicArray);
	}
}

// 2. 获取模版
var master = cat(masterplate);
var template = hbs.compile(master);
var result = template(array); // 此处需要传一个模版数组

// 3. 通过模版生成plist
fs.writeFile(plistFile, result, 'utf-8', function callback(error){
	if (error) {
		console.log("creatFileError");
	} else {
		console.log("creatFileSuccess");
	}
});
