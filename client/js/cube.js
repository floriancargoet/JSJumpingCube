$(function(){
    var grid = new Grid({
        col : 5,
        row : 5
    });

    var gridView = new GridView({
        target : '#grid',
        grid   : grid,
        p1 : {
            name : 'flo'
        },
        p2 : {
            name : 'olaf'
        }
    });
    gridView.render();
    gridView.setupClick();
    //debug
    window.gv = gridView;
});
