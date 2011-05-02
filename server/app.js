var http   = require('http'),  
    sys    = require('sys'),
    io     = require('socket.io'),
    nodestatic = require('node-static');

var staticServer = new nodestatic.Server('./client/'); // cwd must be '..'

var server = http.createServer(function(req, res){ 
    // setup static server
    req.addListener('end', function(){
        staticServer.serve(req, res);
    });
});
server.listen(8000);
  
// socket.io 
var socket = io.listen(server); 
var clients = [];
socket.on('connection', function(client){ 
  // new client is here! 
  clients.push(client);
  
  client.on('message', onClientMessage); 
  client.on('disconnect', onClientDisconnect);
  
  // first message
  client.send('hello');
}); 

function onClientMessage(msg){
    clients.forEach(function(client){
        client.send(msg);
    });
}

function onClientDisconnect(){
}
