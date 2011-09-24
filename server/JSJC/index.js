var publicModules = [
    'Game',
    'GameList',
    'Player',
    'PlayerList'
];

publicModules.forEach(function(publicModule){
    exports[publicModule] = require('./' + publicModule);
});
