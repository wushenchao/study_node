var http = require('http');

var options = {
	host: 'www.google.com',
	port: 80,
	path: '/upload',
	method: 'POST'
} 

var req = http.request(options, function(err, response) {
	console.log('STATUS: ' + response.statusCode) ;
	console.log('HEADERS: ' + JSON.stringify(response.headers)) ;
	response.setEncoding('utf8') ;
	response.on('data', function (chunk){
		console.log('BODY:' + chunk);
	});
});

req.on('error',function(e) {
	
	console.log('problem with request: ' + e.message);
});

req.write('data\n');
req.write('data\n');
req.end();

