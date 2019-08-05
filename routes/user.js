const express = require('express')
const router = express.Router();
const User = require('../models/User');
const alertMessage = require('../helpers/messenger');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const crypto = require("crypto");



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
)


// HOME PAGE

router.get('/home', (req, res) => {
    if (req.user != null) {
        res.render('../views/user/home');
    }
    else {
        alertMessage(res, 'danger', ' Please login to access other features', 'fas fa-pencil-alt', true)
        res.redirect('/user/login')
    }
}),


// PROFILE

router.get('/viewprofile/:id', (req, res) => {
        if (req.user != null) {
            User.findOne({
                where: {
                    id: req.params.id
                }
            }).then(user=>{
                res.render('../views/user/viewprofile', {
                    user
                });
            })
        }
        else {
            alertMessage(res, 'danger', ' Please login to access other features', 'fas fa-pencil-alt', true)
            res.redirect('/user/login')
        }
}),

router.get('/updateprofile/:id', (req, res) => {
        if (req.user != null) {
            User.findOne({
                where: {
                    id: req.params.id
                }
            }).then(user=>{
                res.render('../views/user/updateprofile', {
                    user
                });
            })
        }
        else {
            alertMessage(res, 'danger', ' Please login to access other features', 'fas fa-pencil-alt', true)
            res.redirect('/user/login')
        }
}),

router.post('/updateprofile/:id', (req, res) => {
    let fname = req.body.name
    let lname = req.body.lastname
    let dob = req.body.dob
    let number = req.body.number
    User.update({
        fname,
        lname,
        dob, 
        number
    },{
        where : {
            id: req.params.id
        }
    }).then(user=>{
        res.redirect('/user/viewprofile/'+ req.params.id);
    })

})



// CHANGE PASSWORD

router.get('/changepw/:id', (req, res) => {
    if (req.user != null) {
        User.findOne({
            where: {
                id: req.params.id
            }
        }).then(user =>{
            res.render('../views/user/changepw',{
                user
            });
        })
    }
    else {
        alertMessage(res, 'danger', ' Please login to access other features', 'fas fa-pencil-alt', true)
        res.redirect('/user/login')
    }
}),

router.post('/changepw/:id', (req, res) => {
        let currPass = req.body.currpass
        let password = req.body.newpass;
        let cfmPass = req.body.confirmpass;

        if (password !== cfmPass) {
            alertMessage(res, 'danger', ' Passwords do not match', true)
            res.redirect('back')
        }

        else {
            User.findOne({
                where: {
                    id: req.params.id
                }
            }).then(user => {
                if (user) {
                    bcrypt.compare(currPass, user['password']).then(check => {
                        if (check) {
                            bcrypt.genSalt(10, (err, salt) => {
                                bcrypt.hash(password, salt, (err, hash) => {
                                    user.update({
                                        password: hash,
                                    }).then(() => {
                                        alertMessage(res, 'success', 'Password has been successfully changed.', true)
                                        res.redirect('/');
                                    });
                                });
                            });
                        }
                        else {
                            req.flash('error', 'Current Password is incorrect.');
                            res.redirect('back');
                        }
                    });
                }
                else {
                    alertMessage(res, 'danger', 'User Not Found.', true)
                }
            });
        }
})


// DEL ACC


router.get('/delacc', (req, res) => {
    if (req.user != null) {
        res.render('../views/user/delacc');
    }
    else {
        alertMessage(res, 'danger', ' Please login to access other features', 'fas fa-pencil-alt', true)
        res.redirect('/user/login')
    }
}),

router.post('/delacc/:id', (req, res) => {
        User.findOne({
            id: req.params.id
        }).then((user) => {
            if (user == null) {
                res.redirect('/')
            }
            else {
                User.destroy({
                    where: {
                        id: req.params.id
                    }
                })
                    .then((user) => {
                        console.log('destroy');
                        alertMessage(res, 'success', 'Account successfully deleted.', true)
                        res.redirect('/user/viewprofile/:id')
                    })
            }
        })
})



// LOGOUT

router.get('/logout', (req, res) => {
    alertMessage(res, 'success', 'You have been logged out. ', true);
    req.logout();
    res.redirect('/');
});

module.exports = router;
