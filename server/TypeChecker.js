var toType = function(obj) {
    // if you don't know this trick, see http://javascriptweblog.wordpress.com/2011/08/08/fixing-the-javascript-typeof-operator/
    return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
};

var parallelWalk = function(reference, obj, fn){
    switch(toType(reference)){
        case 'object' :
            return Object.keys(reference).every(function(key){
                return parallelWalk(reference[key], obj[key], fn);
            });
        case 'array' :
            return reference.every(function(item, index){
                return parallelWalk(item, obj[index], fn);
            });
        default :
            return fn(reference, obj);
    }
};

exports.deepCheck = function(obj, reference){
    return parallelWalk(reference, obj, function(refValue, value){
        switch(toType(refValue)){
            case 'function' :
                /*
                 * doesn't work for all primitives: 
                 * /foo/ instanceof RegExp == true 
                 * but 1 instanceof Number == false
                 */
                return value instanceof refValue;
                break;
            case 'string' :
                /*
                 * doesn't work with custom constructors
                 */
                return typeof value == refValue;
                break;
            default :
                throw 'Reference values must be constructors or type names';
        }
    });
};