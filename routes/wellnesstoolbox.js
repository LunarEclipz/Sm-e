const express = require('express');
const router = express.Router();
const alertMessage = require('../helpers/messenger');
const article = require('../models/Article');
const fs = require('fs');
//const upload = require('../helpers/imageUpload');
const multer = require('multer')

const storage = multer.diskStorage({
	destination: function (req, file, callback) {
		callback(null, './uploads/')
	},
	filename: function (req, file, callback) {
		callback(null, Date.now() + file.originalname);
	}
})

const fileFilter = (req, file, callback) => {
	if (file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
		callback(null, true);
	} else {
		callback(null, false);
	}
};

const upload = multer({
	storage: storage,
	limits: { fileSize: 1024 * 1024 },
	fileFilter: fileFilter
});

router.get('/user/wellnesstoolbox', (req, res) => {
	const Title = 'Wellness Toolbox';
	res.render('wellnesstoolbox/user/wellnesstoolbox', { Title: Title })
});

router.get('/admin/wtbmanagement', (req, res) => {
	const Title = 'WTB Management';

	//Retrieve Data
	article.findAll({
		raw: true
	}).then((article) => {
		sortArticle(article)
		res.render('wellnesstoolbox/admin/wtbmanagement', {
			Title: Title,
			medArticle,
			vidArticle,
			musicArticle,
			workArticle,
			depArticle
		});
	}).catch(err => console.log(err))
});

function sortArticle(article) {
	medArticle = []
	vidArticle = []
	musicArticle = []
	workArticle = []
	depArticle = []
	for (i = 0; i < article.length; i++) {
		if (article[i].category == 'Meditation') {
			medArticle.push(article[i])
		} else if (article[i].category == 'Video') {
			vidArticle.push(article[i])
		} else if (article[i].category == 'Music') {
			musicArticle.push(article[i])
		} else if (article[i].category == 'Workout') {
			workArticle.push(article[i])
		} else if (article[i].category == 'Depression Tips') {
			depArticle.push(article[i])
		}
	}
}

router.post('/admin/wtbmanagement', upload.single('Thumbnail'), (req, res) => {
	//Get values from form
	let category = req.body.Category
	let title = req.body.Title
	let description = req.body.Description
	let link = req.body.URL
	let thumbnail = req.file.path
	//console.log(req.body)

	if(title === '') {
		
	}



	//Insert values into DB
	article.create({
		category,
		title,
		description,
		link,
		thumbnail
	}).then((article) => {
		res.redirect('/wellnesstoolbox/admin/wtbmanagement')
	})
});

module.exports = router;
