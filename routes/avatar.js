const express = require('express');
const router = express.Router();
const Avatar = require('../models/avatar');
const Pet = require('../models/adminPet');
const Aspect = require('../models/adminAvatar');
const Sequelize = require('sequelize');
const jimp = require('jimp');
const Op = Sequelize.Op;
const User = require('../models/User');




router.get('/', (req, res) => {
	const EmptyAvatar = 'src="/img/Empy_Mark.png" height=240 width=320';
	const EmptyPet = 'src="/img/Empy_Mark.png" height=240 width=320';
	Avatar.findOne({
			where: { username: "tom" },
			raw: true
	}).then(check_user => {
		const checkuser = check_user.username;


		Avatar.findOne({
			attributes: ['feelings'],
			where: { username: checkuser, feelings: { [Op.ne]: null }},
			raw: true
		}).then(userfeelings => {
			const user_feelings = userfeelings.feelings
			Aspect.findAll({}, {
				where: { Fields: 'Feelings', Name: user_feelings },
				raw: true
			}).then(feelings => {

				Avatar.findOne({
					attributes: ['thoughts'],
					where: { username: checkuser },
					raw: true
				}).then(userthoughts => {

					const user_thoughts = userthoughts.thoughts;


					Aspect.findAll({
						where: { Name: user_thoughts },
						raw: true
					}).then(thoughts => {



						Avatar.findOne({
							attributes: ['actions'],
							where: { username: checkuser },
							raw: true
						}).then(useractions => {
							const user_actions = useractions.actions;


							Aspect.findAll({
								where: { Name: user_actions },
								raw: true
							}).then(actions => {


								Avatar.findOne({
									attributes: ['aura'],
									where: { username: checkuser },
									raw: true
								}).then(useraura => {
									const user_aura = useraura.aura;


									Aspect.findAll({
										where: { Name: user_aura },
										raw: true
									}).then(aura => {
										const fl = 1;
										const tl = 1;
										const al = 1;
										const ul = 1;

										Avatar.findOne({
											attributes: ['pet'],
											where: { username: checkuser },
											raw: true
										}).then(userpet => {
											const user_pet = userpet.pet;


											Pet.findAll({
												where: { petName: user_pet },
												raw: true
											}).then(pets => {
												const images = ['./public/img/Body.png', './public/'+feelings[0].firstURL, './public/'+thoughts[0].firstURL,
												'./public/'+ actions[0].firstURL, './public/'+aura[0].firstURL];
												const jimps = [];
												
												for (var i = 0; i < images.length; i++) {
													jimps.push(jimp.read(images[i]));
												}
												Promise.all(jimps).then(function (data) {
													return Promise.all(jimps);
												}).then(function (data) {
													data[0].composite(data[1], -100, -100);
													data[0].composite(data[2], -100, -190);
													data[0].composite(data[3], -100, 0);
													data[0].composite(data[4], -150, 0);
													data[0].write('public/uploads/final-images/test.png', function () {
														console.log("wrote the image");
													});
												});
												const finalImg = "public/uploads/final-images/test.png";
												res.render('avatar/avatar', {
													AvatarPic: EmptyAvatar, PetPic: EmptyPet,
													checkuser: checkuser, feelings: feelings[0], thoughts: thoughts[0],
													actions: actions[0], aura: aura[0], fl: fl, tl: tl, al: al, ul: ul, check_user: check_user,
													pets: pets[0], finalImg:finalImg
												});
											}).catch(err =>{
												const images = ['./public/img/Body.png', './public/'+feelings[0].firstURL, './public/'+thoughts[0].firstURL,
												'./public/'+ actions[0].firstURL, './public/'+aura[0].firstURL];
												const jimps = [];
												for (var i = 0; i < images.length; i++) {
													jimps.push(jimp.read(images[i]));
												}
												Promise.all(jimps).then(function (data) {
													return Promise.all(jimps);
												}).then(function (data) {
													data[0].composite(data[1], -50, 20);
													data[0].composite(data[2], -50, 0);
													data[0].composite(data[3], -50, -50);
													data[0].composite(data[4], -50, -50);
													data[0].write('public/uploads/final-images/test.png', function () {
														console.log("wrote the image");
													});
												});
												const finalImg = "public/uploads/final-images/test.png";
												res.render('avatar/avatar', {
													AvatarPic: EmptyAvatar, PetPic: EmptyPet,
													checkuser: checkuser, feelings: feelings[0], thoughts: thoughts[0],
													actions: actions[0], aura: aura[0], fl: fl, tl: tl, al: al, ul: ul, check_user: check_user,finalImg:finalImg
												})}); // To catch no video ID
										});
									});
								});
							});
						});
					});
				});
			})
			
			
			;

		}).catch(err =>
			Avatar.findOne({
				attributes: ['pet'],
				where: { username: checkuser },
				raw: true
			}).then(userpet => {
				const user_pet = userpet.pet;


				Pet.findAll({
					where: { petName: user_pet },
					raw: true
				}).then(pets => {
					res.render('avatar/avatar', {
						AvatarPic: EmptyAvatar, PetPic: EmptyPet,
						checkuser: checkuser, check_user: check_user,
						pets: pets[0]
					});
				}).catch(err =>

					res.render('avatar/avatar', {
						AvatarPic: EmptyAvatar, PetPic: EmptyPet,
						checkuser: checkuser,  check_user: check_user,
					})); // To catch no video ID
			}));
	}).catch(err =>
		res.render('avatar/avatar', {
			AvatarPic: EmptyAvatar, PetPic: EmptyPet,
		}));

});












// var Avatar = "SELECT * from smile.avatars";
// var thoughts = "SELECT Fields,Tasks,Name,Quote,noTasks,firstURL,Tasks2,	Quote2,	noTasks2,secondURL,Tasks3,	Quote3,	noTasks3,thirdURL from smile.aspects a inner join smile.avatars s on a.name = s.thoughts;  ";

// smile.query(Avatar, function (err, Avatar) {
//   if (err) throw err;
//   console.log(Avatar);
// });

// smile.query(thoughts, function (err, thoughts) {
//   if (err) throw err;
//   console.log(thoughts);
// });



// 		res.render('avatar/avatar', { AvatarPic: EmptyAvatar, PetPic: EmptyPet, Avatar: Avatar });
//  })
// renders views/index.handlebars


router.get('/createAvatar', (req, res) => {

	Avatar.findOne({
		where: { pet: { [Op.ne]: null } }
	}).then(pets => {
		Aspect.findAll({
		}).then((Aspect) => {
			res.render('avatar/createAvatar', {
				Aspect: Aspect,
				pets: pets
			});
		}).catch(err =>

			Aspect.findAll({
			}).then((Aspect) => {
				res.render('avatar/createAvatar', {
					Aspect: Aspect,
				}) // To catch no video ID
			}));
	});
});







router.post('/updatePet', (req, res) => {
	let feelingsPet = req.body.feelingsPet;
	let pet = req.body.motiv;
	console.log(feelingsPet, pet)
	Avatar.update({ feelingsPet: feelingsPet, pet: pet }, {
		where: { username: "tom" }
	}).then((Avatar) => {
		res.redirect('/avatar');
	})
});

router.post('/updateAvatar', (req, res) => {
	let username = "tom";
	let thoughts = req.body.thoughts;
	let feelings = req.body.feelings;
	let aura = req.body.aura;
	let actions = req.body.actions;
	Avatar.update({ username: username, thoughts: thoughts, aura: aura, actions: actions, feelings: feelings }, {
		where: { username: "tom" }
	}).then((Avatar) => {
		res.redirect('/avatar');
	})
});

router.get('/createPet', (req, res) => {
	Avatar.findOne({
		where: { feelings: { [Op.ne]: null } }
	}).then(Avatar => {
		Pet.findAll({
			// where: { petName: user_pet },
			// raw: true
		}).then(pets => {
			const petName = pets[0].petName;

			res.render('avatar/createPet', {
				pets: pets,
				petName: petName,
				Avatar: Avatar
			});
		});

	}).catch(err =>
		Pet.findAll({
			// where: { petName: user_pet },
			// raw: true
		}).then(pets => {
			const petName = pets[0].petName;

			console.log("PETTITTTS", petName)
			res.render('avatar/createPet', {
				pets: pets,
				petName: petName,
				Avatar: Avatar
			});
		}));

});




router.get('/deletePet', (req, res) => {
	res.render('avatar/deletePet') // renders views/index.handlebars
});

router.get('/deleteAvatar', (req, res) => {
	res.render('avatar/deleteAvatar') // renders views/index.handlebars
});


// Logout User
router.get('/logout', (req, res) => {
	req.logout();
	res.redirect('/');
});

router.post('/saveAvatar', (req, res) => {
	let username = "tom";
	let thoughts = req.body.thoughts;
	let feelings = req.body.feelings;
	let aura = req.body.aura;
	let actions = req.body.actions;
	console.log(thoughts, feelings, aura, actions)
	Avatar.create({
		thoughts,
		feelings,
		aura,
		actions,
		username
	}).then((Avatar) => {
		res.redirect('/avatar');
	})
});

router.post('/savePet', (req, res) => {
	let username = "tom";
	let feelingsPet = req.body.feelingsPet;
	let pet = req.body.motiv;
	Avatar.create({
		feelingsPet,
		pet,
		username
	}).then((Avatar) => {
		res.redirect('/avatar');
	})
});

module.exports = router;