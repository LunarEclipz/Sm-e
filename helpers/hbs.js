const path = require('path')
const fs = require('fs')
const moment = require('moment');

let blocks = {};
let blocksFlag = {};

module.exports= {
    selectCheck: function(value, selectValue){
        if(value == selectValue){
            return 'selected';
        }
        else{
            return '';
        }
    },

    ifCond: function(expression, ops) {
        let result;
        let context = this;
        
        with(context) {
            result = (function() {
                try {
                    return eval(expression);
                }
                catch (e) {
                    if (e instanceof ReferenceError) {
                        return false;
                    }
                    else {
                        console.warn('Expression: {{ifCond \'' + expression + '\'}}\nJS-Error: ', e, '\nContext: ', context);
                    }
                }
            }).call(context);
        }

        return result ? ops.fn(this) : ops.inverse(this);
    },

    partialsDirs: function(src) {     // Handlebars return partials and all folders in partials as array
        let partialsDir = fs.readdirSync(src).filter(f => fs.lstatSync(path.join(src, f)).isDirectory());
        partialsDir.push(path.join(src));

        for (let i = 0, n = partialsDir.length; i < n - 1; i++) {
            partialsDir[i] = path.join(src, partialsDir[i]);
        }

        return partialsDir;
    },
}
