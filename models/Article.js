const Sequelize = require('sequelize');
const db = require('../config/DBConfig');
/* Creates a user(s) table in MySQL Database.
Note that Sequelize automatically pleuralizes the entity name as the table name
*/
const article = db.define('article', {
    category: {
        type: Sequelize.STRING
    },
    title: {
        type: Sequelize.STRING
    },
    description: {
        type: Sequelize.STRING
    },
    link: {
        type: Sequelize.STRING
    },
    thumbnail: {
        type: Sequelize.STRING
    },
    date: {
        type: Sequelize.STRING
    },
    time: {
        type: Sequelize.STRING
    },
    view: {
        type: Sequelize.INTEGER
    }
});
module.exports = article;
