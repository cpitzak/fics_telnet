const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 3000 });

wss.on('connection', function connection(ws) {

    var Telnet = require('telnet-client');
    var telnet = new Telnet();
    var cmd = 'ping';

    var params = {
        host: 'freechess.org',
        port: 5000,
        shellPrompt: /fics[^%]*\%\s*$/,
        loginPrompt: 'login: ',
        passwordPrompt: 'password: ',
        initialLFCR: true,
        timeout: 1000 * 60 * 15,
        failedLoginMatch : "Login incorrect",
      // removeEcho: 4
    };

    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
        let command = message.replace(/\"/g, '');

        telnet.send(command, function(err, res2) {
            if (err) {
                console.log('============== ERROR =============');
            }
        })

      });

    telnet.on('ready', function(prompt) {
        var mins = 1000 * 60 * 14;
        setInterval(function() {
            telnet.exec("ping", function(err, response) {
                console.log("<",response)
            });
        }, mins);
    });

    telnet.on('data',function(msg) {
        ws.send(msg.toString('utf8'));
    });


    telnet.on('failedlogin',function(msg) {
        console.log("Login failed !",msg);
    });

    telnet.on('timeout', function() {
        console.log('socket timeout!')
        telnet.end()
    });

    telnet.on('close', function() {
        console.log('connection closed')
    });

    telnet.connect(params);
    ws.send('xyz134connected');
});
