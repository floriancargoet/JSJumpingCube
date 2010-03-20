var Grid = function(options){
    this.col = options.col;
    this.row = options.row;
    this.target = options.target;
    
    this.createCells();
    this.computeMaxDots();
}

Grid.prototype = {
    computeMaxDots : function(){
        this.maxDots = 2*4 + 3*((this.row-2)*2 +(this.col-2)*2) +4*((this.row-2)*(this.col-2));
    },
    countDots : function(){
        var dots = 0;
        for(i=0, l=this.col;i!=l;i++){
            var j,k;
            for(j=0, k=this.row;j!=k;j++){
                dots+=this.cells[i][j].dots;
            }
        }
        return dots;
    },
    createCells : function(){
        this.cells = [];
        var i,l;
        for(i=0, l=this.col;i!=l;i++){
            this.cells.push([]);
            var j,k;
            for(j=0, k=this.row;j!=k;j++){
                this.cells[i][j] = new Cell({
                    limit : (i==0 || i==this.col-1) ? (
                                (j==0 || j==this.row-1) ?
                                    2 :
                                    3
                            ) :
                                (j==0 || j==this.row-1) ?
                                    3 :
                                    4
                });
            }
        }
    },
    propagate : function(){
        var changed = false;
        var i,l;
        for(i=0, l=this.col;i!=l;i++){
            var j,k;
            for(j=0, k=this.row;j!=k;j++){
                var cell = this.cells[i][j];
                var of = cell.getOverFlowDots();//return 'limit' dots if more than 'limit' is stored and unstore these dots
                if(of>0){
                    var neighborCells = this.findNeighbors(i,j);
                    for(var nc=0, nl = neighborCells.length; nc!=nl; nc++){
                        if(this.countDots() >= this.maxDots){
                            //we diverge before that !
                            //but do we always win before divergence ?
                            //event
                            return;
                        }
                        changed = true;
                        neighborCells[nc].addDot();

                    }
                }
            }
        }
        //recursively
        if(changed){
            this.propagate();
        }
    },
    findNeighbors : function(col, row){
        var neighbors=[], neighbor,
            c,r;
        var trys = [
            [-1,0],
            [1,0],
            [0,1],
            [0,-1]
        ];
        for(var i=0, l=trys.length;i!=l;i++){
            c=trys[i][0];
            r=trys[i][1];
            try{
                neighbor = this.cells[col+c][row+r];
            }catch(e){
                neighbor = null;
            }
            if(neighbor != null){
                neighbors.push(neighbor);
            }
        }
        return neighbors;
    },
    toString : function(){
        var s="",
            i,l;
        for(i=0, l=this.col;i!=l;i++){
            var j,k;
            for(j=0, k=this.row;j!=k;j++){
                s+=this.cells[i][j];
            }
            s+="\n";
        }
        return s;
   }
};