const express = require('express');
const router = express.Router();
const Journal = require('../models/Journal');

// Calendar
router.get('/calendar', (req, res) => {
	Journal.findAll({
	}).then((Journal) => {
		res.render('journal/calendar', {
			Journal: Journal
		});
	});
});

// Mood Tracker
router.get('/moodTracker', (req, res) => {
	const Title = "Mood Tracker";
	res.render('journal/moodTracker', { title: Title })
});

// New Entry
router.get('/newEntry', (req, res) => {
	const Title = "New Entry";
	res.render('journal/newEntry', { title: Title })
});

// Save Entry
router.post('/saveEntry', (req, res) => {
	let entry = req.body.entry;
	let mood = req.body.mood;
	let emotion = req.body.emotion;
	let date = req.body.date;
	let title = req.body.title;
	console.log(entry, date, mood, emotion, title)

	Journal.create({
		entry,
		mood,
		emotion,
		date,
		title
	}).then((Journal) => {
		res.redirect('/journal/calendar');
	})
});

// Update Entry
router.get('/updateEntry/:id', (req, res) => {
	Journal.findOne({
		where: {
			id: req.params.id
		}
	}).then((journal) => {
		res.render('journal/updateEntry', {
			journal: journal
		});
	});
});

router.post('/updateEntry/:id', (req, res) => {
	let id = req.params.id;
	let entry = req.body.entry;
	let mood = req.body.mood;
	let emotion = req.body.emotion;
	let date = req.body.date;
	let title = req.body.title;
	Journal.update({ entry: entry, date: date, mood: mood, emotion: emotion, title: title }, {
		where: { id: id }
	})
		.then((Journal) => {
			res.redirect('/journal/calendar');
		})

});

// Delete Entry
router.post('/deleteEntry/:id', (req, res) => {
	let id = req.params.id
	Journal.destroy({
		where: {
			id: id
		}
	}).then((Journal) => {
		res.redirect('/journal/calendar');
	})
});

module.exports = router;
