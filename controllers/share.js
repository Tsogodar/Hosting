const express = require('express');
const router = express.Router();
const domain = require('../config/domain').getDomain();
const shareModel = require('../models/Share');
const {authenticated} = require('../helpers/authenticated');

//share resource
router.get('/share/:id',authenticated, (req, res) => {
    shareModel.share(req.params.id, (shared) => {
        if (shared) {
            req.flash('share_msg', `${domain.protocol}://${domain.name}/shared/${req.params.id}`)
            res.redirect('back');
        }
    })
});

//unshare resource
router.get('/unshare/:id',authenticated, (req, res) => {
    shareModel.unshare(req.params.id, (unshared) => {
        if (unshared) {
            req.flash('unshare_msg', `Anulowano udostępnianie`)
            res.redirect('back');
        }
    })
});

//open shared resource
router.get('/:id', (req, res) => {
    shareModel.sharedFolder(req.params.id, (shared) => {
        if (shared === null) {
            shareModel.sharedSubFiles(req.params.id, (err, files) => {
                if (files.length===0) {
                    res.render('error/error',{
                        header:'Ups',
                        message:'Plik nie istnieje lub nie jest już udostępniany'
                    })
                } else {
                    files[0].length = Math.floor(files[0].length / 1024);
                    res.render('shared/standaloneFile', {
                        files: files
                    })
                }
            })
        } else {
            shareModel.sharedSubFolders(shared._id, (folders) => {
                shareModel.sharedSubFiles(shared._id, (err, files) => {
                    res.render('shared/show', {
                        shared: shared,
                        folders: folders,
                        files: files,
                    })
                })
            });
        }
    })
});

module.exports = router;