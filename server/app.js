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

/*
 * in these handlers, this == the client socket, 
 * first param is always the player
 */
var clientEventHandlers = {
    'disconnect' : function(player){
        console.log('disconnect');
    },
    'joingame' : function(player, gameId){
        console.log('joingame', gameId);
    },
    'newgame' : function(player, gameConfig){
        var game = new JSJC.Game(gameConfig);
        if(games.add(game)){
            io.sockets.emit('gamelist', games.listAvailable()); // send to all
        }
    },
    'adddot' : function(player, x, y){
        console.log('adddot', x, y);
    }
};
// prepare handlers to be use as socket.io handlers
Object.keys(clientEventHandlers).forEach(function(eventName){
    //original handler
    var handler = clientEventHandlers[eventName];
    // wrap it
    clientEventHandlers[eventName] = function(){
        var args = arguments;
        // retrieve the player object
        this.get('player', function(err, player){
            // then pass it to the original handler as first argument
            Array.prototype.unshift.call(args, player);
            handler.apply(this, args);
        });
    };
});

function bindEvents(socket){
    Object.keys(clientEventHandlers).forEach(function(eventName){
        socket.on(eventName, clientEventHandlers[eventName]);
    });
}
