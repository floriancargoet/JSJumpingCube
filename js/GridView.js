var GridView = function(options){
    this.grid   = options.grid;
    this.target = $(options.target);
    this.colors = {};
    this.p1 = options.p1;
    this.p2 = options.p2;
    this.colors[this.p1.name] = this.p1.color || 'yellow';
    this.colors[this.p2.name] = this.p2.color || 'lightgreen';
    this.currentPlayer = this.p1;
};

GridView.prototype = {
    clickCell : function(player, row, col){//or (player, cell)
        if(row instanceof Cell){
            row.addDot(player);
        }else{
            this.grid.cells[row][col].addDot(player);
        }
        try{
            this.grid.propagate(0);
        }catch(e){
            switch(e.type){
                case 'error':
                    console.error(e.error);
                    break;
                case 'gameover':
                    console.info(e.winner+' wins!');
                    break;
                default :
                    console.error(e);
            }
        }
    },
    render : function(){
        var $table = $('<table/>');
        for(var i=0, l=this.grid.row; i!=l; i++){
            var $tr = $('<tr/>');
            for(var j=0, k=this.grid.col; j!=k; j++){
                var $td = $('<td>');
                $td.data('cell', this.grid.cells[i][j]);
                $tr.append($td);
            }
            $table.append($tr);
        }
        this.target.append($table);
        this.refresh();
    },
    refresh : function(){
        for(var i=0, l=this.grid.row; i!=l; i++){
            var $row = this.target.find('tr:nth-child('+(i+1)+')');
            for(var j=0, k=this.grid.col; j!=k; j++){
                var $cell = $row.children('td:nth-child('+(j+1)+')');
                var cell = this.grid.cells[i][j];
                $cell.html(cell.dots);
                $cell.css('background-color', this.colors[cell.owner]);
            }
        }
    },
    setupClick : function(){
        var that = this;
        this.target.delegate('td', 'click', function(event){
            var cell = $(event.target).data('cell');
            that.clickCell(that.currentPlayer.name, cell);
            that.currentPlayer = (that.currentPlayer == that.p1 ? that.p2 : that.p1);
            that.refresh();
        });
    }
};
