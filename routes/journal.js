const express = require('express');
const router = express.Router();
const Journal = require('../models/Journal');


router.get('/', (req, res) => {
	const title = 'Video Jotter';
	res.render('index', { title: title }) // renders views/index.handlebars
});

// Logout User
router.get('/logout', (req, res) => {
	req.logout();
	res.redirect('/');
});

// Calendar
router.get('/calendar', (req, res) => {
	Journal.findAll({
	}).then((Journal) => {
		res.render('user/calendar', {
			Journal: Journal
		});
	});
});

// Mood Tracker
router.get('/moodTracker', (req, res) => {
	const Title = "Mood Tracker";
	res.render('user/moodTracker', { title: Title })
});

// New Entry
router.get('/newEntry', (req, res) => {
	const Title = "New Entry";
	res.render('user/newEntry', { title: Title })
});

// Save Entry
router.post('/saveEntry', (req, res) => {
	let entry = req.body.entry;
	let mood = req.body.mood;
	let emotion = req.body.emotion;
	let date = req.body.date;
	console.log(entry, date, mood, emotion)

	Journal.create({
		entry,
		mood,
		emotion,
		date
	}).then((Journal) => {
		res.redirect('/calendar');
	})
});

// Update Entry
router.get('/updateEntry/:id', (req, res) => {
	Journal.findOne({
		where:{
			id: req.params.id
		}
	}).then((Journal) => {
		res.render('user/updateEntry', {
			Journal: Journal
		});
	});
});

router.post('/updateEntry/:id', (req, res) => {
	var id = req.params.id
	let entry = req.body.entry;
	let mood = req.body.mood;
	let emotion = req.body.emotion;
	let date = req.body.date;
	Journal.update({entry: entry, date: date, mood: mood, emotion: emotion}, {
		where: {id: id}
		})
		.then((Journal) => {
		res.redirect('/calendar');
	})

});

// Delete Entry
router.post('/deleteEntry/:id', (req, res) => {
	var id = req.params.id
	Journal.destroy({
		where: {
			id: id
		}
	}).then((Journal) => {
		res.redirect('/calendar');
	})
});

module.exports = router;
