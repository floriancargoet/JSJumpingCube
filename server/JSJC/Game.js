var GameState = require('./GameState');

var Game = module.exports = function(config){
    this.name           = config.name;
    this.id             = config.name; // good enough?
    this.players        = [];
    this.nbPlayers      = 0;// == this.players.length
    this.totalNbPlayers = config.totalNbPlayers;
    this.gameState      = new GameState(config.size);
};

Game.prototype.addPlayer = function(player){
    if(this.nbPlayers < this.totalNbPlayers){
        this.players.push(player);
        this.nbPlayers++;
    }
};

Game.prototype.isAvailable = function(){
    return this.nbPlayers < this.totalNbPlayers;
};
