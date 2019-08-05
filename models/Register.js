const Sequelize = require('sequelize');
const db = require('../config/DBConfig');

const Register = db.define('register', {
    eventName: {
        type: Sequelize.STRING
    },
    eid: {
        type: Sequelize.STRING
    },
    user: {
        type: Sequelize.STRING
    }
});
module.exports = Register;
