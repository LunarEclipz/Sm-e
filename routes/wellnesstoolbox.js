const express = require('express');
const router = express.Router();
const alertMessage = require('../helpers/messenger');
const article = require('../models/Article');


router.get('/user/wellnesstoolbox', (req, res) => {
	const title = 'Wellness Toolbox';
	res.render('wellnesstoolbox/user/wellnesstoolbox', { title: title })
});

router.get('/admin/wtbmanagement', (req, res) => {
	const title = 'Wellness Toolbox';

	article.findAll({

	}).then((article) => {
		res.render('wellnesstoolbox/admin/wtbmanagement', {
			article: article
		});
	});
});

router.post('/admin/wtbmanagement', (req, res) => {
	let title = req.body.Title
	let description = req.body.Description
	let link = req.body.URL
	let thumbnail = req.body.Thumbnail
	console.log(title, description, link, thumbnail)

	article.create({
		title,
		description,
		link,
		thumbnail
	}).then((article) => {
		res.redirect('/wellnesstoolbox/admin/wtbmanagement')
	})
});


module.exports = router;
