const moment = require('moment');

module.exports = {
    dateFormat: function (date, targetFormat) {
        return moment(date).format(targetFormat);
    }
};