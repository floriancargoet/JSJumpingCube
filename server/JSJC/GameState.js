var Grid = require('./Grid');

var GameState = module.exports = function(size){
    this.columns = size.columns;
    this.rows    = size.rows;
    this.grid    = new Grid(this.columns, this.rows);
};

GameState.prototype.addDot = function(x, y){

};
