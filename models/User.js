const Sequelize = require('sequelize');
const db = require('../config/DBConfig');

/* Creates a user(s) table in MySQL Database.
Note that Sequelize automatically pleuralizes the entity name as the table name
*/

const User = db.define('user', {
    id: {
        type: Sequelize.INTEGER,
        allowNull:false,
        autoIncrement: true,
        primaryKey: true
    },

    name: {
        type: Sequelize.STRING,
        allownull: false,
        unique: true
    },

    fname: {
        type: Sequelize.STRING,
        allownull: false,
        unique: true
    },

    lname: {
        type: Sequelize.STRING,
        allownull: false,
        unique: true
    },

    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },

    password: {
        type: Sequelize.STRING,
        allowNull: false
    },

    acctype: {
        type: Sequelize.STRING
    },

    dob: {
        type: Sequelize.STRING
    },

    number: {
        type: Sequelize.STRING
    },

    

});

module.exports = User;
