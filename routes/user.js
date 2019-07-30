const express = require('express')
const router = express.Router();
const User = require('../models/User');
const alertMessage = require('../helpers/messenger');
const passport = require('passport');
const bcrypt = require('bcryptjs');


router.get('/register', (req, res) => {
    res.render('../views/user/register');
})

router.get('/loginselect', (req, res) => {
    res.render('../views/user/loginselect');
})


router.get('/regselect', (req, res) => {
    res.render('../views/user/registerselect');
})

router.get('/login', (req, res) => {
    res.render('../views/user/login');
})

router.get('/home', (req, res) => {
    res.render('../views/user/home');
})

router.post('/register', (req, res) => {

    let errors = [];

    // Retrieves fields from register page from request body
    let { name, email, password, password2 } = req.body;

    // Checks if both passwords entered are the same
    if (password !== password2) {
        errors.push({ text: 'Passwords do not match' });
    }

    // Checks that password length is more than 4
    if (password.length < 4) {
        errors.push({ text: 'Password must be at least 4 characters' });
    }
    if (errors.length > 0) {
        res.render('user/register', {
            errors,
            name,
            email,
            password,
            password2
        });
    }
    else {
        // If all is well, checks if user is already registered
        User.findOne({
            where: { email: req.body.email }
        })
            .then(user => {
                if (user) {
                    // If user is found, that means email has already been
                    // registered
                    res.render('user/register', {
                        error: user.email + ' is already registered',
                        name,
                        email,
                        password,
                        password2
                    });
                }
                else {
                    bcrypt.genSalt(10, function (err, salt) {
                        bcrypt.hash(password, salt, function (err, hash) {
                            // Store hash in your password DB.
                            password = bcrypt.hashSync(password, salt)
                            // Create new user record
                            User.create({
                                name,
                                email,
                                password,
                                verfied: 0
                            })
                                .then(user => {
                                    alertMessage(res, 'success', 'You have been registered. Please login. ', true);
                                    res.redirect('./login');
                                })
                                .catch(err => console.log(err));
                        })
                    })



                }
            })
    }
})




router.get('/login', (req, res) => {
    res.render('user/login');
})

router.post('/login',
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/user/login',
        failureFlash: true
    })
);


// Logout User
router.get('/logout', (req, res) => {
    alertMessage(res, 'success', 'You have been logged out. ', true);
    req.logout();
    res.redirect('/');
});
module.exports = router;