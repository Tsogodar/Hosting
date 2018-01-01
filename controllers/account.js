const express = require('express');
const router = express.Router();
const {authenticated} = require('../helpers/authenticated');
const {check, validationResult} = require('express-validator/check');
const userModel = require('../models/User');

router.get('/', authenticated, (req, res) => {
    res.render('account/settings', {
        user: req.user
    })
});

router.post('/updateName', authenticated, [
    check('nameInput').isLength({min: 1}).matches(/\w/)
], (req, res) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        userModel.updateName(req.user.email, req.body.nameInput, (update) => {
            req.flash('change_msg', `Pomyślnie zapisano`);
            res.redirect('/account/#account')
        });
    } else {
        req.flash('error', 'Imię musi zawierać przynajmniej jeden znak');
        res.redirect('/account/#account')
    }
});

router.post('/updateSurname', authenticated, [
    check('surnameInput').isLength({min: 1}).matches(/\w/)
], (req, res) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        userModel.updateSurname(req.user.email, req.body.surnameInput, (update) => {
            req.flash('change_msg', `Pomyślnie zapisano`);
            res.redirect('/account/#account')
        });
    } else {
        req.flash('error', 'Nazwisko musi zawierać przynajmniej jeden znak');
        res.redirect('/account/#account')
    }
});

router.post('/updateEmail', authenticated, [
    check('emailInput').isEmail()
], (req, res) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        userModel.updateEmail(req.user.email, req.body.emailInput, (update) => {
            req.flash('change_msg', `Pomyślnie zapisano`);
            res.redirect('/account/#account')
        })
    } else {
        req.flash('error', 'Błędny format adresu e-mail');
        res.redirect('/account/#account')
    }
});

router.post('/updateTheme', authenticated, (req, res) => {
    if (req.body.themeSwitch === 'on') {
        setNewTheme = {
            set: true,
            value: 'checked'
        }
    } else {
        setNewTheme = {
            set: false,
            value: ''
        }
    }
    userModel.updateTheme(req.user.email, setNewTheme.set, setNewTheme.value, (update) => {
        req.flash('change_msg', `Pomyślnie zapisano`);
        res.redirect('/account/#account')
    });
});


module.exports = router;