const Sequelize = require('sequelize');
const db = require('../config/DBConfig');
/* Creates a user(s) table in MySQL Database.
Note that Sequelize automatically pleuralizes the entity name as the table name
*/
const Aspect = db.define('Aspect', {
    username: {
        type: Sequelize.STRING
    },
    Fields: {
        type: Sequelize.STRING
    },
    Name: {
        type: Sequelize.STRING
    },
    Quote: {
        type: Sequelize.STRING
    },

    Tasks: {
        type: Sequelize.STRING
    },
    firstURL: {
        type: Sequelize.STRING
    },
    noTasks: {
        type: Sequelize.STRING
    },
    Quote2: {
        type: Sequelize.STRING
    },
    Tasks2: {
        type: Sequelize.STRING
    },
    noTasks2: {
        type: Sequelize.STRING
    },
    secondURL: {
        type: Sequelize.STRING
    },
    Quote3: {
        type: Sequelize.STRING
    },
    Tasks3: {
        type: Sequelize.STRING
    },
    noTasks3: {
        type: Sequelize.STRING
    },
    thirdURL: {
        type: Sequelize.STRING
    },
});
module.exports = Aspect;
