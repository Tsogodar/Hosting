const express = require('express');
const router = express.Router();
const upload = require('../config/upload');
const fileModel = require('../models/File');
const userModel = require('../models/User');
const {authenticated} = require('../helpers/authenticated');

router.post('/add/:parent?', authenticated, (req, res) => {
    upload(req, res, (error) => {
        if (error) {
            console.log(error)
        } else {
            res.redirect('back');
        }
    })
});

router.get('/load/:id', authenticated, (req, res) => {
    let readstream = fileModel.loadFile(req.params.id);
    readstream.pipe(res);
});

router.get('/remove/:id', authenticated, (req, res) => {
    fileModel.removeFile(req.params.id,req.user.email, (err) => {
        if (!err)
            res.redirect('back')
    });
});

router.get('/download/:id', (req, res) => {
    fileModel.downloadFile(req.params.id, (error, file) => {
        res.set('Content-Type', file.contentType);
        res.set('Content-Disposition', `attachment; filename="${encodeURI(file.filename)}"`);
        let readstream = fileModel.loadFile(req.params.id);
        readstream.pipe(res);
    })
});

router.post('/space', (req, res) => {
    userModel.checkIfExists(req.user.email, (user) => {
        let filesSize = req.body.fileSize;
        let freeSpace = user.freeSpace;
        let spaceLeft = freeSpace - filesSize;
        if (spaceLeft > 0) {
            userModel.changeFreeSpace(req.user.email, spaceLeft, (spaceUpdated) => {
                res.json({data: true})
            })
        } else {
            res.json({data: false})
        }
    })
});

module.exports = router;