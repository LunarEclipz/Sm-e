const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    const EmptyAvatar = 'src="/img/Empy_Mark.png" height=240 width=320';
    const EmptyPet    = 'src="/img/Empy_Mark.png" height=240 width=320';
	res.render('avatar/avatar', {AvatarPic: EmptyAvatar, PetPic: EmptyPet}) // renders views/index.handlebars
});

router.get('/createAvatar', (req, res) => {
	res.render('avatar/createAvatar') // renders views/index.handlebars
});

router.get('/createPet', (req, res) => {
	res.render('avatar/createPet') // renders views/index.handlebars
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

module.exports = router;