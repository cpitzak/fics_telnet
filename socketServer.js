const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 3000 });

wss.on('connection', function connection(ws) {

    var Telnet = require('telnet-client');
    var connection = new Telnet();

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

    var cmd = 'ping';

    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
        let command = message.replace(/\"/g, '');

        connection.send(command, function(err, res2) {
            if (err) {
                console.log('============== ERROR =============');
            }
            ws.send(res2);
        })

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
        // console.log("stuff: ", msg.toString('utf8'));
        ws.send(msg.toString('utf8'));
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
  
});
