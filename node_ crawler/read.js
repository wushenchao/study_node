var fs = require('fs');

var path = __dirname + '/data.txt';
fs.readFile(path, 'utf-8', function(err, data){
	if (err) {
		console.log(err);
	}
	var obj = JSON.parse(data);

	for (var i = 0; i < obj.length; i++) {
		var data = obj[i];
		console.log(data['ev_time']);
	}
});