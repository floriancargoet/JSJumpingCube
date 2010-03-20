var Cell = function(options){
    this.limit = options.limit;
    this.dots = 1;
}
Cell.prototype = {
    addDot : function(){
        this.dots++;
    },
    getOverFlowDots : function(){
        var of = (this.dots > this.limit) ? this.limit : 0;
        this.dots -= of;
        return of;
    },
    toString : function(){
        return this.dots;
    }
};