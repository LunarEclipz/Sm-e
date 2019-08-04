const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
// Load user model
const User = require('../models/User');

var ex = module.exports = {};
ex.localStrategy = function (passport) {
    passport.use(new LocalStrategy(
        function (username, password, done) {
            User.findOne({
                where: { email: username }
            })
                .then(user => {
                    if (!user) {
                        return done(null, false, { message: 'Incorrect username' });
                    }
                    bcrypt.compare(password, user.password)
                        .then(res => {
                            if (res) {
                                return done(null, user);
                            }
                            else {
                                return done(null, false, { message: 'Incorrect password' });
                            }
                        })


                })
                .catch(err => {
                    return done(err);
                });
        }
    ));
    passport.deserializeUser(function (user, done) {
        User.findByPk(user.id)
            .then((user) => {
                done(null, user); // user object saved in req.session
            })
            .catch((done) => { // No user found, not stored in req.session
                console.log(done);
            });

    });

    passport.serializeUser(function (user, done) {
        done(null, user);
    });

};


// passport.deserializeUser(function (user, done) {
//     done(null, user);
// });


// passport.serializeUser(function (user, done) {
//     done(null, user);
// });





