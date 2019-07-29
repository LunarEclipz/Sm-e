const Sequelize = require('sequelize');
const db = require('../config/DBConfig');
/* Creates a user(s) table in MySQL Database.
Note that Sequelize automatically pleuralizes the entity name as the table name
*/
const Journal = db.define('journal', {
    entry: {
        type: Sequelize.STRING
    },
    mood: {
        type: Sequelize.STRING
    },
    emotion: {
        type: Sequelize.STRING
    },
    date: {
        type: Sequelize.STRING
    }
});
module.exports = Journal;