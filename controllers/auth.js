const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs');
const userModel = require('../models/User');
const passport = require('passport');

router.get('/login', (req, res) => {
    res.render('account/login');
});

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/auth/login',
        failureFlash: true
    })(req, res, next);
});

router.get('/login/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}))

router.get('/login/google/callback',
    passport.authenticate('google', {failureRedirect: '/'}),
    (req, res) => {
        res.redirect('/')
    })

router.get('/register', (req, res) => {
    res.render('account/register');
});

router.post('/register', (req, res) => {
    userModel.checkIfExists(req.body.emailInput, (user) => {
        if (user == null) {
            let newUser = {
                name: req.body.nameInput,
                surname: req.body.surnameInput,
                email: req.body.emailInput
            }
            bcryptjs.genSalt(10, (err, salt) => {
                bcryptjs.hash(req.body.passwordInput, salt, (err, hash) => {
                    if (err) {
                        res.send(err);
                    } else {
                        newUser.password = hash;
                        let saveNewUser = new userModel.User(newUser).save().then(user => {
                            req.flash('success_register_msg', 'Rejestracja przebiegła pomyślnie');
                            res.redirect('/auth/login');
                        }).catch(err => {
                            console.log(err);
                        })
                    }
                });
            })
        } else {
            req.flash('fail_register_msg', 'Użytkownik o podanym adresie już istnieje');
            res.redirect('/auth/register');
        }
    })
});

router.get('/logout',(req,res)=>{
    req.logout();
    req.flash('success_logout_msg','Pomyślnie wylogowano');
    res.redirect('/auth/login');
});

module.exports = router;