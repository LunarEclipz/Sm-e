const express = require('express')
const router = express.Router();
const Admin = require('../models/Admin');
const alertMessage = require('../helpers/messenger');
const passport = require('passport');
const bcrypt = require('bcryptjs');

router.get('/admregister', (req, res) => {
    res.render('../views/admin/adminreg');
})

router.get('/admlogin', (req, res) => {
    res.render('../views/admin/adminlogin');
})

router.get('/admhome', (req, res) => {
    res.render('../views/admin/adminhome');
})


// Admin Register
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
        res.render('admin/adminreg', {
            errors,
            name,
            email,
            password,
            password2
        });
    }
    else {
        // If all is well, checks if user is already registered
        Admin.findOne({
            where: { email: req.body.email }
        })
            .then(admin => {
                if (admin) {
                    // If user is found, that means email has already been
                    // registered
                    res.render('admin/adminreg', {
                        error: admin.email + ' is already registered',
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
                            Admin.create({
                                name,
                                email,
                                password,
                                verfied: 0
                            })
                                .then(admin => {
                                    alertMessage(res, 'success', 'You have been registered. Please login. ', true);
                                    res.redirect('./admlogin');
                                })
                                .catch(err => console.log(err));
                        })
                    })



                }
            })
    }
})

// Admin Login
router.post('/admlogin',
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/admlogin',
        failureFlash: true
    },
    (req, res) => {
        // console.log(req.user.username);
        // res.redirect('/', {user: 'test'});
    })
);


// Admin Logout
router.get('/logout', (req, res) => {
    alertMessage(res, 'success', 'You have been logged out. ', true);
    req.logout();
    res.redirect('/');
});

module.exports = router;
