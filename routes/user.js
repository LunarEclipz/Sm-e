const express = require('express')
const router = express.Router();
const User = require('../models/User');
const alertMessage = require('../helpers/messenger');
const passport = require('passport');
const bcrypt = require('bcryptjs');


// REGISTER

router.get('/register', (req, res) => {
    res.render('../views/user/register');
})

router.get('/adminreg', (req, res) => {
    res.render('../views/user/adminreg');
})

router.get('/regselect', (req, res) => {
    res.render('../views/user/regselect');
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
                                verfied: 0,
                                acctype: "user"
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

router.post('/adminreg', (req, res) => {

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
        res.render('user/adminreg', {
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
                    res.render('user/adminreg', {
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
                                verfied: 0,
                                acctype: "admin"
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



// LOGIN

router.get('/login', (req, res) => {
    res.render('../views/user/login');
})


router.post('/login',

    passport.authenticate('local', {
        successRedirect: '/user/home',
        failureRedirect: '/user/login',
        failureFlash: true
    }),
    function (req, res, next) {
        // issue a remember me cookie if the option was checked
        if (!req.body.remember_me) { return next(); }

        var token = utils.generateToken(64);
        Token.save(token, { userId: req.user.id }, function (err) {
            if (err) { return done(err); }
            res.cookie('remember_me', token, { path: '/', httpOnly: true, maxAge: 604800000 }); // 7 days
            return next();
        });
    },
    function (req, res) {
        res.redirect('/');
    }
)


// FORGET PW

router.get('/forgot', (req, res) => {
    res.render('../views/user/forgot');
})


router.post('/forgot', (req, res) => {
    if (req.method === 'GET') {
        res.render('auth/forgot');
    }
    else if (req.method === 'POST') {
        let token = crypto.randomBytes(20).toString('hex');

        User.findOne({ where: { email: req.body.email } }).then(user => {
            if (user) {
                user.update({
                    resetPasswordToken: token,
                    resetPasswordExpires: Date.now() + 3600000
                });

                let link = `http://${req.headers.host}/reset/${token}`;

                email.send(
                    user.email,
                    '[Outsource] Password Reset',
                    `<p>You are receiving this because you (or someone else) have requested the reset of the password for your account.</p>` +
                    `<p>Please click on the following link, or paste this into your browser to complete the process:<br>` +
                    `<a href="${link}">${link}</a></p>` +
                    `<p>If you did not request this, please ignore this email and your password will remain unchanged.</p>`
                );
                req.flash('success', 'A verification email has been sent to ' + user.email);
            }
            else {
                req.flash('error', 'No account with that email address exists.');
            }

            res.redirect('/forgot');
        });
    }
})

router.get('/reset', (req, res) => {
   
})

// HOME PAGE

router.get('/home', (req, res) => {
    res.render('../views/user/home');
}),


// PROFILE

router.get('/viewprofile', (req, res) => {
    res.render('../views/user/viewprofile');
}),

router.get('/updateprofile', (req, res) => {
    res.render('../views/user/updateprofile');
}),

router.get('/changepw', (req, res) => {
    res.render('../views/user/changepw');
}),

router.get('/delacc', (req, res) => {
    res.render('../views/user/delacc');
}),
// LOGOUT

router.get('/logout', (req, res) => {
    alertMessage(res, 'success', 'You have been logged out. ', true);
    req.logout();
    res.redirect('/');
});

module.exports = router;
