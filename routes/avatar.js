const express = require('express');
const router = express.Router();
const Avatar = require('../models/avatar');
const Pet = require('../models/adminPet');
const Aspect = require('../models/adminAvatar');
const Sequelize = require('sequelize');
const jimp = require('jimp');
const Op = Sequelize.Op;
const User = require('../models/User');
const alertMessage = require('../helpers/messenger');

var fl = 1;
var tl = 1;
var al = 1;
var ul = 1;


function getPercentage(tasktype, userwriting, userjournal, userevent, taskno){
	if (tasktype == 'Events'){
		return (userevent/taskno)*100;
	}
	if (tasktype == 'Encouragements'){
	    return (userjournal/taskno)*100;

	}
	if (tasktype == 'Writing'){
		return (userwriting/taskno)*100;
	}

}

function updateLevel(field, fpb, apb, tpb, upb, fl, tl, al, ul){
	if (field == "Feelings" && fpb >= 100){
		fpb = 0;
		fl = 2;
		return fl
	}
	
	if (field == "Thoughts" && apb >= 100){
		tpb = 0;
		tl = 2;
		console.log(tl, "HIIIII");
		return tl

	}
	if (field == "Actions" && tpb >= 100){
		apb = 0;
		al = 2;
		return al

	}
	if (field == "Aura" && upb >= 100){
		upb = 0;
		ul = 2;
		return ul

	}

}


router.get('/', (req, res) => {
	const EmptyAvatar = 'src="/img/Empy_Mark.png" height=240 width=320';
	const EmptyPet = 'src="/img/Empy_Mark.png" height=240 width=320';
	console.log(req.user.name);
	Avatar.findOne({
			where: { username: req.user.name },
			raw: true
	}).then(check_user => {
		const checkuser = check_user.username;


		Avatar.findOne({
			attributes: ['feelings'],
			where: { username: checkuser, feelings: { [Op.ne]: null }},
			raw: true
		}).then(userfeelings => {
			const user_feelings = userfeelings.feelings
			Aspect.findAll({where: { Fields: 'Feelings', Name: user_feelings },
			raw: true}).then(feelings => {

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
										const userwriting = check_user.writing;
										const userencourage = check_user.encourage;
										const userevent = check_user.event;

										const fpb = getPercentage(feelings[0].Tasks, userwriting, userencourage, userevent, feelings[0].noTasks);
										const tpb = getPercentage(thoughts[0].Tasks, userwriting, userencourage, userevent, thoughts[0].noTasks);
										const apb = getPercentage(actions[0].Tasks, userwriting, userencourage, userevent, actions[0].noTasks);
										const upb = getPercentage(aura[0].Tasks, userwriting, userencourage, userevent, aura[0].noTasks);

										console.log(upb + "++++++THIS", aura[0].Tasks, userwriting, userencourage, userevent, aura[0].noTasks);
										fl = updateLevel("Feelings", fpb, apb, tpb, upb, fl , tl, al, ul);
										tl = updateLevel("Thoughts", fpb, apb, tpb, upb, fl , tl, al, ul);
										al = updateLevel("Actions", fpb, apb, tpb, upb, fl , tl, al, ul);
										ul = updateLevel("Aura", fpb, apb, tpb, upb, fl , tl, al, ul);
										if (fl != 2){
											fl = 1
										}
										if (tl != 2){
											tl = 1
										}
										if (al != 2){
											al = 1
										}
										if (ul != 2){
											ul = 1
										}
										var fp =  feelings[0].firstURL;
										var fq = feelings[0].Quote;
										var ft = feelings[0].Tasks;
										var fn = feelings[0].noTasks;

										var tp =  thoughts[0].firstURL;
										var tq = thoughts[0].Quote;
										var tt = thoughts[0].Tasks;
										var tn = thoughts[0].noTasks;

										var ap =  actions[0].firstURL;
										var aq = actions[0].Quote;
										var at = actions[0].Tasks;
										var an = actions[0].noTasks;

										var up =  aura[0].firstURL;
										var uq = aura[0].Quote;
										var ut = aura[0].Tasks;
										var un = aura[0].noTasks;

										if (fl == 2){
											 fp =  feelings[0].secondURL;
											 fq = feelings[0].Quote2;
											 ft = feelings[0].Tasks2;
											 fn = feelings[0].noTasks2;
										}
										if (tl == 2){
											tp =  thoughts[0].secondURL;
											 tq = thoughts[0].Quote2;
											 tt = thoughts[0].Tasks2;
											 tn = thoughts[0].noTasks2;
										}
										if (al == 2){
											ap =  actions[0].secondURL;
											 aq = actions[0].Quote2;
											 at = actions[0].Tasks2;
											 an = actions[0].noTasks2;
										}
										if (ul == 2){
											up =  aura[0].secondURL;
											uq = aura[0].Quote2;
											ut = aura[0].Tasks2;
											un = aura[0].noTasks2;
										}

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
												const ppb = getPercentage(pets[0].tasks, userwriting, userencourage, userevent, pets[0].noTasks);

												const images = ['./public/img/Body.png', './public/'+fp, './public/'+tp,
												'./public/'+ ap, './public/'+up];
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
													pets: pets[0], finalImg:finalImg, fpb:fpb, tpb:tpb, apb:apb, upb:upb, fp:fp, fn:fn, fq:fq, ft:ft,
													tp:tp, tn:tn, tt:tt, tq:tq, ap:ap, an:an, at:at, aq:aq, up:up, ut:ut, un:un, uq:uq, ppb:ppb
												});
											}).catch(err =>{

												const images = ['./public/img/Body.png', './public/'+fl, './public/'+thoughts[0].firstURL,
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
													actions: actions[0], aura: aura[0], fl: fl, tl: tl, al: al, ul: ul, check_user: check_user, finalImg:finalImg,
													fpb:fpb, tpb:tpb, apb:apb, upb:upb, fp:fp, fn:fn, fq:fq, ft:ft,  
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
					const ppb = getPercentage(pets[0].tasks, userwriting, userencourage, userevent, Pet[0].noTasks);

					res.render('avatar/avatar', {
						AvatarPic: EmptyAvatar, PetPic: EmptyPet,
						checkuser: checkuser, check_user: check_user,
						pets: pets[0], ppb:ppb
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
		where: { pets: { [Op.ne]: null }, user: req.user.name }
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
	}).catch(err =>

		Aspect.findAll({
		}).then((Aspect) => {
			res.render('avatar/createAvatar', {
				Aspect: Aspect,
			}) // To catch no video ID
		}));;
});







router.post('/updatePet', (req, res) => {
	alertMessage(res, 'success', 'You have added a pet. ', true);

	let feelingsPet = req.body.feelingsPet;
	let pet = req.body.motiv;
	console.log(feelingsPet, pet)
	Avatar.update({ feelingsPet: feelingsPet, pet: pet }, {
		where: { username: req.user.name }
	}).then((Avatar) => {
		res.redirect('/avatar');
	})
});

router.post('/updateAvatar', (req, res) => {
	alertMessage(res, 'success', 'You have added an Avatar. ', true);

	let username = req.user.name;
	let thoughts = req.body.thoughts;
	let feelings = req.body.feelings;
	let aura = req.body.aura;
	let actions = req.body.actions;
	
	Avatar.update({ username: username, thoughts: thoughts, aura: aura, actions: actions, feelings: feelings }, {
		where: { username: req.user.name }
	}).then((Avatar) => {
		res.redirect('/avatar');
	})
});

router.get('/createPet', (req, res) => {
	Avatar.findOne({
		where: { feelings: { [Op.ne]: null} , username: req.user.name} 
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
			});
		}));

});




router.get('/deletePet', (req, res) => {
	res.render('avatar/deletePet') // renders views/index.handlebars
});

router.post('/deleteAvatar/:name', (req, res) => {
	alertMessage(res, 'danger', 'You have deleted a pet. ', true);
	var name = req.params.name;
	fl = 1;
	tl = 1;
	al = 1;
	ul = 1;
	Avatar.destroy({
		where: {
			username: name
		}
	}).then((Avatar) => {
		res.redirect('/avatar');
	})
});


// Logout User
router.get('/logout', (req, res) => {
	req.logout();
	res.redirect('/');
});

router.post('/saveAvatar', (req, res) => {
	alertMessage(res, 'success', 'You have added an Avatar. ', true);

	let username = req.user.name;
	let thoughts = req.body.thoughts;
	let feelings = req.body.feelings;
	let aura = req.body.aura;
	let actions = req.body.actions;
	let writing = 0;
	let encourage = 0;
	let event = 0;
	console.log(thoughts, feelings, aura, actions)
	Avatar.create({
		thoughts,
		feelings,
		aura,
		actions,
		username,
		writing,
		event,
		encourage
	}).then((Avatar) => {
		res.redirect('/avatar');
	})
});

router.post('/savePet', (req, res) => {
	alertMessage(res, 'success', 'You have added a pet. ', true);

	let username = req.user.name;
	let feelingsPet = req.body.feelingsPet;
	let pet = req.body.motiv;
	let writing = 0;
	let encourage = 0;
	let event = 0;
	Avatar.create({
		feelingsPet,
		pet,
		username,
		writing,
		event,
		encourage
	}).then((Avatar) => {
		res.redirect('/avatar');
	})
});



module.exports = router;