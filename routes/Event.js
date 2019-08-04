const Sequelize = require('sequelize');
const db = require('../config/DBConfig');

const Event = db.define('event', {
    eventName: {
        type: Sequelize.STRING
    },
    eventDescription: {
        type: Sequelize.STRING(2000)
    },
    eventCost: {
        type: Sequelize.STRING
    },
    eventLocation: {
        type: Sequelize.STRING
    },
    eventCategory: {
        type: Sequelize.STRING
    },
    eventDate: {
        type: Sequelize.DATE
    },
    eventTime: {
        type: Sequelize.TIME
    },
    eventEndTime: {
        type: Sequelize.TIME
    },
    posterURL: {
        type: Sequelize.STRING(512)
    },
    latitude: {
        type: Sequelize.STRING
    },
    longtitude: {
        type: Sequelize.STRING
    },
});
module.exports = Event;