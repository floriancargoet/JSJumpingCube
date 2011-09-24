// requires
var http       = require('http'),  
    sys        = require('sys'),
    io         = require('socket.io'),
    nodestatic = require('node-static');

var JSJC = require('./JSJC');

// games management
var games   = new JSJC.GameList();
var players = new JSJC.PlayerList();

// webserver
var staticServer = new nodestatic.Server('./client/'); // cwd must be '..'
var server = http.createServer(function(req, res){ 
    // setup static server
    req.addListener('end', function(){
        staticServer.serve(req, res);
    });
});
server.listen(8000);

// socket.io 
io = io.listen(server);

io.sockets.on('connection', function (socket) {
    // attach all event listeners
    bindEvents(socket);
    // create an associated Player
    var player = new JSJC.Player();
    players.add(player);
    //store the player object in the socket
    socket.set('player', player, function(){
        //then, send the list of available games
        socket.emit('gamelist', games.listAvailable());
    });
});

// in these handlers, this == the client socket
var clientEventHandlers = {
    'disconnect' : function(){
        console.log('disconnect', arguments);
    },
    'joingame' : function(gameId){
        console.log('joingame', gameId);
    },
    'newgame' : function(gameConfig){
        var game = new JSJC.Game(gameConfig);
        if(games.add(game)){
            io.sockets.emit('gamelist', games.listAvailable()); // send to all
        }
    },
    'adddot' : function(x, y){
        console.log('adddot', x, y);
    }
};

function bindEvents(socket){
    for(var eventName in clientEventHandlers){
        if(clientEventHandlers.hasOwnProperty(eventName)){
            socket.on(eventName, clientEventHandlers[eventName]);
        }
    }
}
