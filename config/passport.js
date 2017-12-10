const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const userModel = require('../models/User');

module.exports = (passport) => {
    passport.use(new LocalStrategy({
        usernameField: 'emailInput',
        passwordField: 'passwordInput'
    }, (email, password, done) => {
        userModel.User.findOne({
            email: email
        }).then(user => {
            if (!user) {
                return done(null, false, {message: 'Błędne dane logowania'})
            }
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) {
                    console.log(err);
                }
                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, {message: 'Błędne dane logowania'});
                }
            });
        })
    }));
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        userModel.User.findById(id, function (err, user) {
            done(err, user);
        });
    });
    passport.use(new GoogleStrategy({
            clientID:process.env.googleOauth2ClientIdentity,
            clientSecret:process.env.googleOauth2SecretKey,

            // clientID: '1021882735911-tn9q6de9l35614hdaq52me0jtas47gr7.apps.googleusercontent.com',
            // clientSecret: 'qXKLJnyi8BjMdM8D3mjRAqgd',

            callbackURL: '/auth/login/google/callback',
            proxy: true
        }, (accessToken, refreshToken, profile, done) => {
            const newUser = {
                googleID: profile.id,
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
                email: profile.emails[0].value,
            }
            userModel.User.findOne({
                googleID: profile.id
            }).then(user => {
                if (user) {
                    done(null, user)
                } else {
                    new userModel.User(newUser).save().then(user => done(null, user))
                }
            })
        })
    )
    passport.serializeUser((user, done) => {
        done(null, user)
    })
    passport.deserializeUser((id, done) => {
        userModel.User.findById(id).then(user => done(null, user))
    })
};