const express = require('express');
const router = express.Router();
const alertMessage = require('../helpers/messenger');
const user = require('../models/User');


router.get('/', (req, res) => {
	const title = 'SMILE';
	console.log(req.user.id)
	// renders views/index.handlebars, passing title as an object
	res.render('index', {title: title})
	
	});

router.get('/about', (req, res) => {
	let success_msg = 'Success message';
	let error_msg = 'Error message using error_msg';
	
	res.render('about', {
		success_msg: success_msg,
		error_msg: error_msg
	})
});

router.get('/profile', (req, res) => {
	res.render('../views/user/profile');
})

router.get('/admhome', (req, res) => {
	res.render('../views/admin/admhome');
})

module.exports = router;
