var Cell = function(options){
    this.limit = options.limit;
    this.owner = options.owner;
    this.dots = 1;
}
Cell.prototype = {
    addDot : function(owner){
        this.owner = owner;
        this.dots++;
    },
    getOverFlowDots : function(){
        var of = (this.dots > this.limit) ? this.limit : 0;
        this.dots -= of;
        return of;
    },
    toString : function(){
        var firstLetter = this.owner ? this.owner[0]:'';
        return ""+this.dots+firstLetter;
    }
};