const express = require('express');
const router = express.Router();


router.get('/about', (req, res) => {
	const title = 'About';
	var author = 'Robert Lim';
	res.render('about', {title: title, author: author});
});

router.get('/hopeboard', (req, res) => {
	const title = 'Hopeboard';
	res.render('hopeboard/hopeboard', {title: title}) 
});

module.exports = router;
