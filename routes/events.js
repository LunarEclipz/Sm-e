const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const Register = require('../models/Register')
const moment = require('moment');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const fs = require('fs')
const upload = require('../helpers/imageUpload');
const alertMessage = require('../helpers/messenger');


router.get('/eventDisplay', (req, res) => {
	if (req.user != null) {
		Event.findAll({
		}).then((events) => {
			Register.findAll({
				where: {
					user: req.user.id
				}
			}).then((registers) => {
				res.render('events/user/eventDisplay', {
					events: events,
					registers
				})
			})

		})
			.catch(err => console.log(err))
	}
	else {
		alertMessage(res, 'danger', 'Please login to access other features', 'fas fa-pencil-alt', true)
		res.redirect('/user/login')
	}
});

router.get('/eventInfo/:id', (req, res) => {
	if (req.user != null) {
		Event.findOne({
			where: {
				id: req.params.id
			}
		}).then((event) => {
			res.render('events/user/eventInfo', {
				event: event
			})
		})
			.catch(err => console.log(err));
	}
	else {
		alertMessage(res, 'danger', 'Please login to access other features', 'fas fa-pencil-alt', true)
		res.redirect('/user/login')
	}
});

router.get('/find', (req, res) => {
	const { term } = req.query
	Event.findAll({ where: Sequelize.or({ eventName: { [Op.like]: '%' + term + '%' } }, { eventDescription: { [Op.like]: '%' + term + '%' } }, { eventCategory: { [Op.like]: '%' + term + '%' } }, { eventLocation: { [Op.like]: '%' + term + '%' } }, { eventCost: { [Op.like]: '%' + term + '%' } }, { eventTime: { [Op.like]: '%' + term + '%' } }, { eventEndTime: { [Op.like]: '%' + term + '%' } }) })
		.then(events => res.render('events/user/eventDisplay', { events }))
		.catch(err => console.log(err));
})

router.get('/cancel/:id', (req, res) => {
	Register.findOne({
		where: {
			id: req.params.id,
			user: req.user.id
		}
	}).then((register) => {
		Register.destroy({
			where: {
				id: req.params.id,
				user: req.user.id
			}
		}).then((register) => {
			alertMessage(res, 'info', 'You have cancelled your registration.', 'fas fa-remove', true)
			res.redirect('/events/eventDisplay')
		})
	})
})

module.exports = router;
