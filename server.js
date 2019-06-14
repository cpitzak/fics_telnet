var Telnet = require('telnet-client')
var connection = new Telnet()

var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var PORT = 3000;

/* 
	To see if the regex works run this in the terminal:
	echo 'fics% ' | grep -o  'fics[^%]*\%\s*$'
	If it works then you'll get 'fics% ' back.
	If it doesn't work then you'll get nothing back.
*/

var params = {
	host: 'freechess.org',
	port: 5000,
	shellPrompt: /fics[^%]*\%\s*$/,
	loginPrompt: 'login: ',
	passwordPrompt: 'password: ',
	username: 'nivo',
	password: 'osdcpi',
	initialLFCR: true,
	timeout: 1000 * 60 * 15,
	failedLoginMatch : "Login incorrect",
  // removeEcho: 4
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

var cmd = 'ping';

app.post('/cmd', function(req, res){
 connection.send(req.body.cmd, function(err, res2) {
 	if (err) {
		 res.status(500).send('There was an error. Please contact the web administrator.');
		 return err;
	 }
	 res.send({'text': res2});
 })
});

var server = app.listen(PORT, function () {
	var port = server.address().port;
	console.log('Listening at http://localhost:' + port);
});

connection.on('ready', function(prompt) {
	var mins = 1000 * 60 * 14;
	console.log(prompt);
	console.log('ready');
	setInterval(function() {
		console.log(">" + cmd);
		connection.exec("ping", function(err, response) {
			console.log("<",response)
		});
	}, mins);
})

connection.on('data',function(msg) {
	console.log("stuff: ", msg.toString('utf8'));
});


connection.on('failedlogin',function(msg) {
	console.log("Login failed !",msg);
});

connection.on('timeout', function() {
	console.log('socket timeout!')
	connection.end()
})

connection.on('close', function() {
	console.log('connection closed')
})

connection.connect(params)