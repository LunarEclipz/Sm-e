const Sequelize = require('sequelize');
const db = require('../config/DBConfig');
/* Creates a user(s) table in MySQL Database.
Note that Sequelize automatically pleuralizes the entity name as the table name
*/
const Avatar = db.define('avatar', {
    username: {
        type: Sequelize.STRING
    },
    thoughts: {
        type: Sequelize.STRING
    },
    feelings: {
        type: Sequelize.STRING
    },
    actions: {
        type: Sequelize.STRING
    },
    aura: {
        type: Sequelize.STRING
    },
    pet: {
        type: Sequelize.STRING
    },    
    feelingsPet: {
        type: Sequelize.STRING
    },   
});
module.exports = Avatar;
