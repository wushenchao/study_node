/*
 *  读取路径下的所有文件
 */

var fs = require('fs');
var stdin = process.stdin;
var stdout = process.stdout;

var stats = [];

fs.readdir(process.cwd(), function (err, files){
	// 打印当前路径
	console.log (process.cwd());
	console.log(' ');

	if (!files.length) {
		return console.log(' \033[31m No files to show! \033[39m\n]]');
	} else {
		// 当前文件的个数
		console.log ('当前有: ' + files.length + ' 个文件或文件夹。');
	}

	function file(i){
		var filename = files[i];

		fs.stat(__dirname + '/' + filename, function (err, stat){
			stats[i] = stat;
			if (stat.isDirectory()) {
				console.log(' ' + i + ' \033[36m' + filename + '/\033[39m');
			} else {
				console.log(' ' + i + ' \033[90m' + filename + '/\033[39m');
			}
			i++;

			if (i == files.length) {
				read();
			} else {
				file(i);
			}
		});
	}

	function read(){
		console.log(' ');
		stdout.write(' \033[33mEnter your choice : \033[39m');
		// resume触发data事件以及end事件，不然会一直等待
		stdin.resume();
		stdin.setEncoding('utf8');
		stdin.on('data', option);
	}

	/*
	 * 读取内容
	 */
	
	function option(data) {

		var filename = files[Number(data)];

		if (!files[Number(data)]) {

			stdout.write(' \033[mEnter your choice : \033[39m');
		} else if (stats[Number(data)].isDirectory()) {

			fs.readdir(__dirname + '/' + filename, function(err, files) {
				console.log (' ');
				console.log ('(' + files.length + 'files)');
				files.forEach (function(file) {
					console.log (' - ' + file);
				});
				console.log (' ');
			});
		} else {
			stdin.pause();
			fs.readFile(__dirname + '/' + filename, 'utf8', function(err, data){
				console.log (' ');
				console.log (' \033[90m' + data.replace(/(.*)/g, ' $1') + ' 033[39m');
				
				// 向文件中写入内容 
				// writeFile会自动删除旧文件，直接写入新文件
				// appendFile如果文件不存在，会自动创建新文件
				fs.writeFile('./node/test.js', data, function(err){
					if (err){
						console.log (err);
					} else {
						console.log ('Success');
					}
				});
			});
		}
	}

	file(0);
});


/*
 * 读取一个文件内容
 */

// 读取大文件方法
/*
var reader = fs.createReadStream('in.txt');
var writer = fs.createWriteStream('out.txt');

reader.on ('data', function (chunk){
	writer.write(chunk);
});
reader.on('end' ,function(){
	writer.end();
});
*/

/*
var rs = fs.createReadStream('./node/test.js');
var data = '';

rs.on(data, function(chuck){
	data += chuck;
});

rs.on('end', function(){
	console.log(data);
});

 */






