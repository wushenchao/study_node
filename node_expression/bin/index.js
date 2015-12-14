// 通过 配置文件 生成plits 和 重命名 表情名称 

// https://github.com/shelljs/shelljs
require('shelljs/global');
var fs = require('fs');

var confFile = __dirname + '/../conf/Expression.conf'; // 配置文件路径
var plistFile = __dirname + '/../plist/Expression.plist'; // 生成的plist路径
var imageFile = __dirname + '/../Expressions/'; // 表情存放路径

// 1. read expression conf 
var fileJson = cat(confFile);
var dic = JSON.parse(fileJson);

// 2. prase dic 
var content = "<array>\n";
for (var key in dic) {
	var value = dic[key];
	var str = "<dict>\n<key>"+value+"</key>\n<string>"+value+"</string>\n</dict>\n";
	content = content + str;

	// change fileName
	var newPath = imageFile +  value + "@2x.png";
	var oldPath = imageFile + key;
	fs.rename(oldPath, newPath);
}
content = content + "</array>";

// 3. write content
fs.writeFile(plistFile, content, 'utf-8', function callback(error){
	if (error) {
		console.log("creatFileError");
	} else {
		console.log("creatFileSuccess");
	}
});
