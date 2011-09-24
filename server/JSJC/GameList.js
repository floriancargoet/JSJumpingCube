
var GameList = module.exports = function(){
    this.games = {};
};


GameList.prototype.listAvailable = function(){
    var available = [], b
        games = this.games;
    for(var gameId in games) if(games.hasOwnProperty(gameId)) {
        var game = games[gameId];
        if(game.isAvailable()){
            available.push({
                name           : game.name,
                nbPlayers      : game.nbPlayers,
                totalNbPlayers : game.totalNbPlayers
            });
        }
    }
    return available;
};

GameList.prototype.add = function(game){
    var id = game.id;
    if(this.games[id]){
        return false; // failure, id already exists
    }
    this.games[id] = game;
    return true; // success
};

GameList.prototype.get = function(id){
    return this.games[id];
};
