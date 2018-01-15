const express = require('express');
const router = express.Router();
const shareModel = require('../models/Share');
const folderModel = require('../models/Folder');
const {authenticated} = require('../helpers/authenticated');
const {check, validationResult} = require('express-validator/check');
const bcryptjs = require('bcryptjs');
const userModel = require('../models/User');

router.get('/', authenticated, (req, res) => {
    shareModel.shareSettFolders(req.user.email, (folders) => {
        shareModel.shareSettFiles(req.user.email, (error, files) => {
            res.render('account/settings', {
                files: files,
                folders: folders,
                user: req.user
            })
        })
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

router.post('/updatePass', authenticated, [
    check('passwordNewInput').isLength({min: 1}).matches(/\w/).custom((value, {req, loc, path}) => {
        if (value !== req.body.passwordConfirmNewInput) {
            throw new Error("dontMatch");
        } else {
            return value;
        }
    })
], (req, res) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        let pass = {
            old: req.body.passwordInput,
            newPass: req.body.passwordNewInput,
            newPassConfirm: req.body.passwordConfirmNewInput
        };
        userModel.checkIfExists(req.user.email, (user) => {
            if (bcryptjs.compareSync(pass.old, user.password)) {
                bcryptjs.genSalt(10, (err, salt) => {
                    bcryptjs.hash(pass.newPass, salt, (err, hash) => {
                        if (err) {
                            res.send(err);
                        } else {
                            userModel.updatePassword(req.user.email, hash, (update => {
                                req.flash('change_msg', `Pomyślnie zapisano`);
                                res.redirect('/account/#account')
                            }))
                        }
                    });
                })
            } else {
                req.flash('error', 'Obecne hasło jest błędne');
                res.redirect('/account/#account');
            }
        })
    } else {
        switch (errors.mapped().passwordNewInput.msg) {
            case 'Invalid value':
                req.flash('error', 'Hasło nie może zawierać wyłącznie znaku spacji');
                res.redirect('/account/#account');
                break;
            case 'dontMatch':
                req.flash('error', 'Hasła muszą być identyczne');
                res.redirect('/account/#account');
                break;
        }
    }
});

//purge
router.get('/purge', authenticated, (req, res) => {
    folderModel.purge(req,res,req.user.email)
});

//del account

module.exports = router;