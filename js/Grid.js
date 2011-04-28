var Grid = function(options){
    this.col = options.col;
    this.row = options.row;
    
    this.createCells();
}

Grid.prototype = {
    eachCell : function(fn, scope){
        for(var i=0, l=this.col;i!=l;i++){
            for(var j=0, k=this.row;j!=k;j++){
                var ret = fn.call(scope || window, this.cells[i][j], i, j, this);
                if(ret === false){
                    return;
                }
            }
        }
    },
    createCells : function(){
        this.cells = [];
        for(var i = 0, l = this.col; i != l; i++){
            this.cells.push([]);
            for(var j = 0, k = this.row; j != k; j++){
                var limit = 4;
                if(i == 0 || i == this.col - 1) limit--;
                if(j == 0 || j == this.row - 1) limit--;
                
                this.cells[i][j] = new Cell({
                    limit : limit
                });
            }
        }
    },
    propagate : function(run){
        if(run > 100){
            throw {
                type  : 'error',
                error : 'Too much recursion'
            };
        }
        var changed = false;
        this.eachCell(function(cell, i, j){
            var of = cell.getOverFlowDots();//return 'limit' dots if more than 'limit' is stored and unstore these dots
            var owner = cell.owner;
            if(of > 0){
                var neighborCells = this.findNeighbors(i,j);
                for(var nc = 0, nl = neighborCells.length; nc != nl; nc++){
                    changed = true;
                    neighborCells[nc].addDot(owner);
                }
            }
        }, this);
        //check is there is a winner after each propagation
        var winner = this.checkVictory();
        if(winner){
            throw {
                type   : 'gameover',
                winner : winner
            };
        }
                    
        //continue propagation if needed
        if(changed){
            return this.propagate(run+1);
        }
        return run;
    },
    checkVictory : function(){
        //all cell must be owned, and by the same player
        var winner = this.cells[0][0].owner,
            owner;
        if(!winner) return;
        this.eachCell(function(cell){
            owner = cell.owner;
            if(!owner || winner != owner){
                winner = null;
                return false; //break loop
            }
        });
        return winner;
    },
    findNeighbors : function(col, row){
        var neighbors=[], neighbor,
            c,r;
        var tries = [
            [-1,0],
            [1,0],
            [0,1],
            [0,-1]
        ];
        for(var i=0, l=tries.length;i!=l;i++){
            c=tries[i][0];
            r=tries[i][1];
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
