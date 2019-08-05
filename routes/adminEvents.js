const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const Register = require('../models/Register')
const moment = require('moment');
const Sequelize = require('sequelize');
const axios = require('axios')
const Op = Sequelize.Op;
const fs = require('fs')
const upload = require('../helpers/imageUpload');
const alertMessage = require('../helpers/messenger');

router.get('/addEvent', (req, res) => {
	if (req.user != null){
		if (req.user.acctype != 'admin'){
			alertMessage(res, 'danger', 'You are not authorised', 'fas fa-pencil-alt', true)
			res.redirect('/user/home')
		}
		else{
			res.render('events/admin/addEvent')
		}
	}
	else{
		alertMessage(res, 'danger', 'Please login to access other features', 'fas fa-pencil-alt', true)
		res.redirect('/user/login')
	}
});


router.post('/addEvent', (req, res) => {
	let errors = []
	let success_msg = '';
	let eventName = req.body.eventName;
	let eventDescription = req.body.eventDescription;
	let eventCost = req.body.eventCost;
	let eventLocation = req.body.eventLocation;
	let eventCategory = req.body.categories.toString();
	let eventDate = moment(req.body.eventDate, 'DD/MM/YYYY');
	let eventTime = req.body.eventTime;
	let eventEndTime = req.body.eventEndTime;
	let posterURL = req.body.posterURL;
	let numberJoined = 0;

	if (isNaN(eventCost) == true && eventCost.toLowerCase() != 'free') {
		errors.push({ text: "Invalid Event Cost" })
	}

	if (!eventCost || eventCost.toLowerCase() == 'free') {
		eventCost = 'free';
	} else {
		eventCost = `$${eventCost}`
	}

	if (errors.length > 0) {
		res.render('events/admin/addEvent', {
			errors,
			eventName,
			eventDescription,
			eventCost,
			eventLocation,
			eventCategory,
			eventDate,
			eventTime,
			eventEndTime,
			posterURL,
			numberJoined
		})
	}
	else {
		axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
			params: {
				address: eventLocation,
				key: 'AIzaSyCAY6l_kdezwueW1JJgqSt1IX4sqZnbZWA'
			}
		})
			.then((response) => {
				let latitude = (response.data.results[0].geometry.location.lat)
				let longtitude = (response.data.results[0].geometry.location.lng)

				Event.create({
					errors,
					eventName,
					eventDescription,
					eventCost,
					eventLocation,
					eventCategory,
					eventDate,
					eventTime,
					eventEndTime,
					posterURL,
					latitude,
					longtitude,
					numberJoined
				}).then((event) => {
					alertMessage(res, 'success', 'Event successfully added', 'fas fa-calendar-alt', true)
					res.redirect('/adminEvents/adminDisplayEvent')
				}).catch(err => console.log(err));
			})
			.catch(err => console.log(err))
	}
});

router.get('/editEvent', (req, res) => {
	if (req.user != null){
		if (req.user.acctype != 'admin'){
			alertMessage(res, 'danger', 'You are not authorised', 'fas fa-pencil-alt', true)
			res.redirect('/user/home')
		}
		else{
			res.render('events/admin/editEvent')
		}
	}
	else{
		alertMessage(res, 'danger', 'Please login to access other features', 'fas fa-user-alt', true)
		res.redirect('/user/login')
	}
});

router.get('/adminDisplayEvent', (req, res) => {
	if (req.user != null){
		if (req.user.acctype != 'admin'){
			alertMessage(res, 'danger', 'You are not authorised', 'fas fa-pencil-alt', true)
			res.redirect('/user/home')
		}
		else{
			Event.findAll({
			}).then((events) => {
				res.render('events/admin/adminDisplayEvent', {
					events: events,
					user : req.user.id
				})
			})
				.catch((err) => console.log(err))
		}
	}
	else{
		alertMessage(res, 'danger', 'Please login to access other features', 'fas fa-user-alt', true)
		res.redirect('/user/login')
	}
});


router.get('/delete/:id', (req, res) => {
	Event.findOne({
		where: {
			id: req.params.id
		}
	}).then((event) => {
		Event.destroy({
			where: {
				id: req.params.id
			}
		}).then((event) => {
			alertMessage(res, 'danger', 'You have deleted the event', 'fas fa-trash-alt', true)
			res.redirect('/adminEvents/adminDisplayEvent')
		})
	})
})

router.get('/editEvent/:id', (req, res) => {
	if (req.user != null){
		if (req.user.acctype != 'admin'){
			alertMessage(res, 'danger', 'You are not authorised', 'fas fa-pencil-alt', true)
			res.redirect('/user/home')
		}
		else{
			Event.findOne({
				where: {
					id: req.params.id
				}
			}).then((event) => {
				checkTick(event);
				res.render('events/admin/editEvent', {
					event
				})
			})
		}
	}
	else{
		alertMessage(res, 'danger', 'Please login to access other features', 'fas fa-user-alt', true)
		res.redirect('/user/login')
	}
})

function checkTick(event) {
	event.depression = (event.eventCategory.search('Depression') >= 0) ? 'checked' : '';
	event.anxiety = (event.eventCategory.search('Anxiety') >= 0) ? 'checked' : '';
	event.moodDisorder = (event.eventCategory.search('Mood Disorder') >= 0) ? 'checked' : '';
	event.eatingDisorder = (event.eventCategory.search('Eating Disorder') >= 0) ? 'checked' : '';
	event.postTraumaticStress = (event.eventCategory.search('Post-Traumatic Stress') >= 0) ? 'checked' : '';
	event.socialAnxiety = (event.eventCategory.search('Social Anxiety') >= 0) ? 'checked' : '';
}

router.put('/saveEdit/:id', (req, res) => {
	let errors = []
	let success_msg = ''
	let eventName = req.body.eventName;
	let eventDescription = req.body.eventDescription;
	let eventCost = req.body.eventCost;
	let eventLocation = req.body.eventLocation;
	let eventCategory = req.body.categories.toString();
	let eventDate = moment(req.body.eventDate, 'DD/MM/YYYY');
	let eventTime = req.body.eventTime;
	let eventEndTime = req.body.eventEndTime;
	let posterURL = req.body.posterURL;

	if (isNaN(eventCost) == true && eventCost.toLowerCase() != 'free') {
		errors.push({ text: "Invalid Event Cost" })
	}

	if (!eventCost || eventCost.toLowerCase() == 'free') {
		eventCost = 'free';
	} else if (eventCost[0] != '$') {
		eventCost = `$${eventCost}`
	}

	if (errors.length > 0) {
		alertMessage(res, 'danger', 'Invalid Event Cost', 'fas fa-pencil-alt', true)
		res.redirect('back')
	}
	else {
		axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
			params: {
				address: eventLocation,
				key: 'AIzaSyCAY6l_kdezwueW1JJgqSt1IX4sqZnbZWA'
			}
		})
			.then((response) => {
				let latitude = (response.data.results[0].geometry.location.lat)
				let longtitude = (response.data.results[0].geometry.location.lng)

				Event.update({
					errors,
					eventName,
					eventDescription,
					eventCost,
					eventLocation,
					eventCategory,
					eventDate,
					eventTime,
					eventEndTime,
					posterURL,
					latitude,
					longtitude,
				}, {
						where: {
							id: req.params.id
						}
					}).then(() => {
						alertMessage(res, 'info', 'Event successfully edited', 'fas fa-pencil-alt', true)
						res.redirect('/adminEvents/adminDisplayEvent')
					}).catch(err => console.log(err));
			})
			.catch(err => console.log(err))
	}
})

router.get('/search', (req, res) => {
	const { term } = req.query
	Event.findAll({ where: Sequelize.or({ eventName: { [Op.like]: '%' + term + '%' } }, { eventDescription: { [Op.like]: '%' + term + '%' } }, { eventCategory: { [Op.like]: '%' + term + '%' } }, { eventLocation: { [Op.like]: '%' + term + '%' } }, { eventCost: { [Op.like]: '%' + term + '%' } }, { eventTime: { [Op.like]: '%' + term + '%' } }, { eventEndTime: { [Op.like]: '%' + term + '%' } }) })
		.then(events => res.render('events/admin/adminDisplayEvent', { events }))
		.catch(err => console.log(err));
})

router.get('/geocode', (req, res) => {
	var location = eventLocation
	axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
		params: {
			address: location,
			key: 'AIzaSyCAY6l_kdezwueW1JJgqSt1IX4sqZnbZWA'
		}
	})
		.then((response) => {
			let latitude = (response.data.results[0].geometry.location.lat)
			let longtitude = (response.data.results[0].geometry.location.lng)

			Event.create({
				latitude,
				longtitude,
			}).then((event) => {

			}).catch(err => console.log(err));
		})
		.catch(err => console.log(err))
})

// Upload poster
router.post('/upload', (req, res) => {
	// Creates user id directory for upload if not exist
	if (!fs.existsSync('./public/uploads/')) {
		fs.mkdirSync('./public/uploads/');
	}

	upload(req, res, (err) => {
		if (err) {
			res.json({
				file: '/img/no-image.jpg',
				err: err
			});
		} else {
			if (req.file === undefined) {
				res.json({
					file: '/img/no-image.jpg',
					err: err
				});
			} else {
				res.json({
					file: `/uploads/${req.file.filename}`
				});
			}
		}
	});
})

router.post('/eventInfo/:id', (req, res) => {
	
	Event.findOne({
		where: {
			id: req.params.id
		}
	}).then((event) => {			
		Register.findOne({
			where:{
				user: req.user.id,
				eid: req.params.id
			}
		}).then((duplicates)=>{
			if (duplicates != null){
				alertMessage(res, 'danger', 'You have already registered for this event', 'fas fa-calendar-alt', true)
				res.redirect('/events/eventDisplay')
			}
			else{
				if (event){
					Event.update({
						numberJoined: event.numberJoined + 1
					}, {
							where: {
								id: req.params.id
							}
						})
					}
					
				let eid = req.params.id
				let eventName = event.eventName
				let user = req.user.id;
		
				Register.create({
					eid,
					eventName,
					user,
				}).then((register) => {
					alertMessage(res, 'success', 'You have registered for "' + register.eventName + '"', 'fas fa-calendar-alt', true)
					res.redirect('/events/eventDisplay')
				})
			}
		})
	})
})

module.exports = router;