const express = require('express');
const router = express.Router();
const Pet = require('../models/adminPet');
const Aspect = require('../models/adminAvatar');
const fs = require('fs');
const upload = require('../helpers/petPicUpload');
const firstUpload = require('../helpers/firstLevel');
const secondUpload = require('../helpers/secondLevel');
const thirdUpload = require('../helpers/thirdLevel');




// var Handlebars = require('handlebars');

// Handlebars.registerHelper('ifCond', function(v1, v2, options) {
// 	if(v1 == v2) {
// 	  return options.fn(this);
// 	}
// 	return options.inverse(this);
//   });
router.post('/upload', (req, res) => {
	// Creates user id directory for upload if not exist
	if (!fs.existsSync('./public/uploads/' )) {
		fs.mkdirSync('./public/uploads/' );
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

router.post('/firstUpload', (req, res) => {
	// Creates user id directory for upload if not exist
	if (!fs.existsSync('./public/uploads/' )) {
		fs.mkdirSync('./public/uploads/' );
	}

	firstUpload(req, res, (err) => {
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

router.post('/secondUpload', (req, res) => {
	// Creates user id directory for upload if not exist
	if (!fs.existsSync('./public/uploads/' )) {
		fs.mkdirSync('./public/uploads/' );
	}

	secondUpload(req, res, (err) => {
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

router.post('/thirdUpload', (req, res) => {
	// Creates user id directory for upload if not exist
	if (!fs.existsSync('./public/uploads/' )) {
		fs.mkdirSync('./public/uploads/' );
	}

	thirdUpload(req, res, (err) => {
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
router.post('/addAspect', (req, res) => {
	let Fields = req.body.Fields;
	let Tasks = req.body.Tasks;
	let noTasks = req.body.noTasks;
	let Name = req.body.Name;
	let Quote = req.body.Quote;
	let firstURL = req.body.firstURL;
	let Tasks2 = req.body.Tasks2;
	let noTasks2 = req.body.noTasks2;
	let Quote2 = req.body.Quote2;
	let secondURL = req.body.secondURL;
	let Tasks3 = req.body.Tasks3;
	let noTasks3 = req.body.noTasks3;
	let Quote3 = req.body.Quote3;
	let thirdURL = req.body.thirdURL;
	console.log(Fields, Tasks, Name, Quote, noTasks, Tasks2, Quote2, noTasks2, Tasks3, Quote3, noTasks3)
	Aspect.create({
		Fields,
		Tasks,
		Name,
		Quote,
		noTasks,
		firstURL,
		Tasks2,
		Quote2,
		noTasks2,
		secondURL,
		Tasks3,
		Quote3,
		noTasks3,
		thirdURL
	}).then((Aspect) => {
		res.redirect('/adminAvatar/editAvatar');
	})
});

router.post('/addPet', (req, res) => {
	let petName = req.body.petName;
	let tasks = req.body.tasks;
	let noTasks = req.body.noTasks;
	let quotes = req.body.quotes;
	let petPicURL = req.body.petPicURL;

	console.log(petName, tasks, quotes, noTasks, petPicURL)
	Pet.create({
		petName,
		tasks,
		quotes,
		noTasks,
		petPicURL,
	}).then((Pet) => {
		res.redirect('/adminAvatar/pets');
	})
});


router.get('/', (req, res) => {
	res.render('adminAvatar/adminAvatar') // renders views/index.handlebars
});



router.get('/pets', (req, res) => {
	Pet.findAll({
	}).then((Pet) => {
		res.render('adminAvatar/pet', {
			Pet: Pet
		});
	});
});

router.get('/petInfo/:id', (req, res) => {
	Pet.findOne({
		where: {
			id: req.params.id
		}
	}).then((Pet) => {
		res.render('adminAvatar/petInfo', {
			Pet: Pet
		});
	});
});

router.get('/editAspect/:id', (req, res) => {
	Aspect.findOne({
		where: {
			id: req.params.id
		}
	}).then((Aspect) => {
		res.render('adminAvatar/editAspect', {
			Aspect: Aspect
		});
	});
});


router.post('/updatePet/:id', (req, res) => {
	var id = req.params.id
	let petName = req.body.petName;
	let tasks = req.body.tasks;
	let noTasks = req.body.noTasks;
	let quotes = req.body.quotes;
	Pet.update({ petName: petName, tasks: tasks, noTasks: noTasks, quotes: quotes }, {
		where: { id: id }
	})
		.then((Pet) => {
			res.redirect('/adminAvatar/pets');
		})
});

router.post('/updateAspect/:id', (req, res) => {
	var id = req.params.id

	let Fields = req.body.Fields;
	let Tasks = req.body.Tasks;
	let noTasks = req.body.noTasks;
	let Name = req.body.Name;
	let Quote = req.body.Quote;
	let firstURL = req.body.firstURL;
	let Tasks2 = req.body.Tasks2;
	let noTasks2 = req.body.noTasks2;
	let Quote2 = req.body.Quote2;
	let secondURL = req.body.secondURL;
	let Tasks3 = req.body.Tasks3;
	let noTasks3 = req.body.noTasks3;
	let Quote3 = req.body.Quote3;
	let thirdURL = req.body.thirdURL;
	Aspect.update({ Fields: Fields, Quote: Quote, Tasks: Tasks, noTasks: noTasks, Name: Name,
		Quote2: Quote2, Tasks2: Tasks2, noTasks2: noTasks2, 
		Quote3: Quote3, Tasks3: Tasks3, noTasks3: noTasks3, firstURL:firstURL, secondURL:secondURL,thirdURL:thirdURL  }, {
		where: { id: id }
	})
		.then((Aspect) => {
			res.redirect('/adminAvatar/editAvatar');
		})
});

router.post('/deletePet/:id', (req, res) => {
	var id = req.params.id
	Pet.destroy({
		where: {
			id: id
		}
	}).then((Pet) => {
		res.redirect('/adminAvatar/pets');
	})
});

router.post('/deleteAspect/:id', (req, res) => {
	var id = req.params.id
	Aspect.destroy({
		where: {
			id: id
		}
	}).then((Aspect) => {
		res.redirect('/adminAvatar/editAvatar');
	})
});




// .catch(err => console.log(err))
// res.render('adminAvatar/editPet') // renders views/index.handlebars


router.get('/editPet', (req, res) => {

	res.render('adminAvatar/editPet');

})

router.get('/addAspect', (req, res) => {

	res.render('adminAvatar/addAspect');

})
// Upload poster

router.get('/editAvatar', (req, res) => {
	Aspect.findAll({
	}).then((Aspect) => {
		res.render('adminAvatar/editAvatar', {
			Aspect:Aspect
		}); // renders views/index.handlebars
	})
});





module.exports = router;