const Sequelize = require('sequelize');
const db = require('../config/DBConfig');

/* Creates a user(s) table in MySQL Database.
Note that Sequelize automatically pleuralizes the entity name as the table name
*/
const Pet = db.define('Pet', {
    petName: {
        type: Sequelize.STRING
    },
    quotes: {
        type: Sequelize.STRING
    },
    tasks: {
        type: Sequelize.STRING
    },

    noTasks: {
        type: Sequelize.STRING
    },
    petPicURL: {
        type: Sequelize.STRING
    },
});
module.exports = Pet;
