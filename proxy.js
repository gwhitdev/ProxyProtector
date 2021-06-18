const net = require('net');
const CardChecker = require('./modules/cardChecker.js');
const ServerTestCheck = require('./modules/serverCheckTest');

const LOCAL_PORT = 6512;
const REMOTE_PORT = 10000;
const REMOTE_ADD = "127.0.0.1";

const cardRegexes = {
    'Visa': /^4[0-9]{12}(?:[0-9]{3})?$/,
    'Mastercard': /^(?:5[1-5][0-9]{2}|222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}$/,
}

const server = net.createServer(function (socket) {
    socket.on('data', function (msg) {
        console.log(' START INTERCEPTING ');
        console.log(' >> From CLIENT TO PROXY ',msg.toString()); //msg.toString()
        console.log();
        
        const serverTestCheck = new ServerTestCheck(msg);
        const isServerTest = serverTestCheck.checkForServerTest();
        console.log('is server test?',isServerTest);
        
        if(!isServerTest) {
            const cardChecker = new CardChecker(msg,cardRegexes);
            const messageToCheck = cardChecker.createStringToCheck();
            const checked = cardChecker.checkForCardNumbers(messageToCheck);
            console.log('checked:',checked);
        }
        
        
        if(!isServerTest && checked !== 'Clean') {
            const newMsg = JSON.stringify({"message":"Message blocked"});
            socket.write(newMsg);
            return;
        }

        const serviceSocket = new net.Socket();
            serviceSocket.connect(parseInt(REMOTE_PORT), REMOTE_ADD, function() {
                console.log(' >> From proxy to remote '); //msg.toString()
                serviceSocket.write(msg);
            });
            serviceSocket.on("data", function(data) {
                console.log(" << From remote to proxy", data.toString());
                socket.write(data);
                console.log(' >> From proxy to client', data.toString());
            });
    });
});

server.listen(LOCAL_PORT);
console.log("TCP proxy server accepting connection on port: " + LOCAL_PORT);