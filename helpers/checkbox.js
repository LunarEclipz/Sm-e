const moment = require('moment');

module.exports = {
    checkbox: function(value, radioValue){
        // Write your codes here
        if (value.includes(radioValue)){
            return 'checked';
        }
        else{
            return '';
        }
    }
};