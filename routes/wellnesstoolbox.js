const express = require('express');
const router = express.Router();
const alertMessage = require('../helpers/messenger');
const article = require('../models/Article');
const fs = require('fs');
//const upload = require('../helpers/imageUpload');
const multer = require('multer');
const sequelize = require('sequelize');
const Op = sequelize.Op;

// Date Creator
let today = new Date();
let dd = today.getDate();

let mm = today.getMonth() + 1;
let yyyy = today.getFullYear();
if (dd < 10) {
	dd = '0' + dd;
}

if (mm < 10) {
	mm = '0' + mm;
}
today = dd + '/' + mm + '/' + yyyy;

//Image Storage
const storage = multer.diskStorage({
	destination: function (req, file, callback) {
		callback(null, './wtbuploads/')
	},
	filename: function (req, file, callback) {
		callback(null, Date.now() + file.originalname);
	}
});
//Image File Filter
const fileFilter = (req, file, callback) => {
	if (file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
		callback(null, true);
	} else {
		callback(null, false);
	}
};
//Initialise Upload
const upload = multer({
	storage: storage,
	limits: { fileSize: 1024 * 1024 },
	fileFilter: fileFilter
});

router.get('/user/wellnesstoolbox', (req, res) => {
	const Title = 'Wellness Toolbox';

	//Retrieve Data from DB
	article.findAll({
		raw: true
	}).then((article) => {
		sortArticle(article)
		res.render('wellnesstoolbox/user/wellnesstoolbox', {
			Title: Title,
			medArticle,
			vidArticle,
			musicArticle,
			workArticle,
			depArticle
		});
	}).catch(err => console.log(err))
});



//Create
router.post('/admin/wtbmanagement', upload.single('Thumbnail'), (req, res) => {
	//Get values from form
	let category = req.body.Category;
	let title = req.body.Title;
	let description = req.body.Description;
	let link = req.body.URL;
	let errors = 0

	req.flash('info', 'Flash is back!')
 	


	if (title.length > 14) {
		req.flash('title', 'Title must be 14 characters or less')
	}

	if (description.length > 30) {
		req.flash('desc', 'Description must be 30 characters or less')
	}

	if (errors > 0) {
		res.redirect('/wellnesstoolbox/admin/wtbmanagement')
	}

	else {

		//If Have Thumbnail, Create
		if (req.file != undefined) {
			article.create({
				category,
				title,
				description,
				link,
				thumbnail: ('/' + req.file.path),
				date: today,
				time: (new Date()).getTime(),
				view: 0
			}).then((article) => {

				res.redirect('/wellnesstoolbox/admin/wtbmanagement')
			})
		}

		//If No Thumbnail, Create with defaultThumbnail
		else {
			article.create({
				category,
				title,
				description,
				link,
				thumbnail: '/wtbuploads/default.jpg',
				date: today,
				time: (new Date()).getTime(),
				view: 0
			}).then((article) => {
				res.redirect('/wellnesstoolbox/admin/wtbmanagement')
			})
		}

	}

	//Form Info
	// console.log(req.body)
	//Thumbnail Info
	// console.log(req.file)
	//Insert values into DB

});
//Delete
router.get('/admin/wtbmanagement/delete/:id', (req, res) => {
	article.findOne({
		where: {
			id: req.params.id,
			//userId: req.user.id
		},
	}).then((articles) => {
		article.destroy({
			where: {
				id: articles.id
			}
		}).then((article) => {
			res.redirect('/wellnesstoolbox/admin/wtbmanagement')
		})
	})
});

//Edit
router.post('/admin/wtbmanagement/edit/:id', upload.single('Thumbnail'), (req, res) => {
	let newcategory = req.body.Category
	let newtitle = req.body.Title
	let newdescription = req.body.Description
	let newlink = req.body.URL
	console.log(`\x1b[33m cat: ${newcategory}, title: ${newtitle}, desc: ${newdescription}, link: ${newlink}\x1b[0m`);
	console.log(`\x1b[33m thumbnail: ${req.file}\x1b[0m`);

	article.findOne({
		raw: true,
		where: {
			id: req.params.id,
			//userId: req.user.id
		}
	}).then(data => {
		if (data) {
			//If have Thumbnail, Set new Thumbnail
			if (req.file != undefined) {
				article.update({
					category: newcategory,
					title: newtitle,
					description: newdescription,
					link: newlink,
					thumbnail: ('/' + req.file.path),
					date: today,
					time: (new Date()).getTime()
				},
					{
						where: { id: data['id'] }
					}).then(() => {
						res.redirect('/wellnesstoolbox/admin/wtbmanagement');
					})
			}
			else {
				//If No Thumbnail, Dont set Thumbnail
				article.update({
					category: newcategory,
					title: newtitle,
					description: newdescription,
					link: newlink,
					date: today,
					time: (new Date()).getTime()
				},
					{
						where: { id: data['id'] }
					}).then(() => {
						res.redirect('/wellnesstoolbox/admin/wtbmanagement');
					})
			}
		}

		else {
			res.redirect('/wellnesstoolbox/admin/wtbmanagement');
		}
	});
});

//RENDER
router.get('/admin/wtbmanagement', (req, res) => {
	

	const Title = 'WTB Management';
	let errors = '';
	
	//let errors = [{text:req.flash('desc')}];

	//Retrieve Data from DB
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
			depArticle,
			article,
			errors: errors,
			//test: req.flash('info')

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
};

//Search

//Search in Meditation
router.get('/search/meditation', (req, res) => {
	const { term } = req.query;
	console.log(term)

	article.findAll({ where: { category: { [Op.like]: 'Meditation'}, title: { [Op.like]: '%' + term + '%'} } })
		.then((medArticle) => {
			article.findAll({
				raw: true
			}).then((article) => {
				sortArticle(article)
				res.render('wellnesstoolbox/admin/wtbmanagement', {
					medArticle,
					vidArticle,	
					musicArticle,
					workArticle,
					depArticle,
					article
				});
			}).catch(err => console.log(err)) });
});

//Search in Video
router.get('/search/video', (req, res) => {
	const { term } = req.query;
	console.log(term)

	article.findAll({ where: { category: { [Op.like]: 'Video'}, title: { [Op.like]: '%' + term + '%'} } })
		.then((vidArticle) => {
			article.findAll({
				raw: true
			}).then((article) => {
				sortArticle(article)
				res.render('wellnesstoolbox/admin/wtbmanagement', {
					medArticle,
					vidArticle,	
					musicArticle,
					workArticle,
					depArticle,
					article
				});
			}).catch(err => console.log(err)) });
});

//Search in Music
router.get('/search/music', (req, res) => {
	const { term } = req.query;
	console.log(term)

	article.findAll({ where: { category: { [Op.like]: 'Music'}, title: { [Op.like]: '%' + term + '%'} } })
		.then((musicArticle) => {
			article.findAll({
				raw: true
			}).then((article) => {
				sortArticle(article)
				res.render('wellnesstoolbox/admin/wtbmanagement', {
					medArticle,
					vidArticle,	
					musicArticle,
					workArticle,
					depArticle,
					article
				});
			}).catch(err => console.log(err)) });
});

//Search in Workout
router.get('/search/workout', (req, res) => {
	const { term } = req.query;
	console.log(term)

	article.findAll({ where: { category: { [Op.like]: 'Workout'}, title: { [Op.like]: '%' + term + '%'} } })
		.then((workArticle) => {
			article.findAll({
				raw: true
			}).then((article) => {
				sortArticle(article)
				res.render('wellnesstoolbox/admin/wtbmanagement', {
					medArticle,
					vidArticle,	
					musicArticle,
					workArticle,
					depArticle,
					article
				});
			}).catch(err => console.log(err)) });
});

//Search in Depression Tips
router.get('/search/depressiontips', (req, res) => {
	const { term } = req.query;
	console.log(term)

	article.findAll({ where: { category: { [Op.like]: 'Depression Tips'}, title: { [Op.like]: '%' + term + '%'} } })
		.then((medArticle) => {
			article.findAll({
				raw: true
			}).then((article) => {
				sortArticle(article)
				res.render('wellnesstoolbox/admin/wtbmanagement', {
					medArticle,
					vidArticle,	
					musicArticle,
					workArticle,
					depArticle,
					article
				});
			}).catch(err => console.log(err)) });
});

module.exports = router;
