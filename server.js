var Telnet = require('telnet-client')
var connection = new Telnet()

var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var PORT = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var cmd = 'ping';

app.post('/foo', function(req, res){
	// console.log(">" + req.body.cmd);
 //    connection.exec(req.body.cmd, function(err, response) {
 //       console.log("output: ",response)
 //       res.send(req.body.cmd);
 //    });
 connection.send(req.body.cmd, function(err, res2) {
 	if (err) return err
 		res.send();
 })
});

var server = app.listen(PORT, function () {
	var port = server.address().port;
	console.log('Listening at http://localhost:' + port);
});

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
	username: 'LEFT_BLANK_FILL_THIS_IN_BEFORE_RUNNING',
	password: 'LEFT_BLANK_FILL_THIS_IN_BEFORE_RUNNING',
	initialLFCR: true,
	timeout: 1000 * 60 * 5,
	failedLoginMatch : "Login incorrect",
  // removeEcho: 4
}

connection.on('ready', function(prompt) {
	var mins = 1000 * 60 * 4;
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