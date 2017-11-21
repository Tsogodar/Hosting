const express = require('express')
const router = express.Router();
const shareModel = require('../models/Share')

//open shared folder
router.get('/:id', (req, res) => {
    shareModel.sharedFolder(req.params.id, (shared) => {
        if (shared === null) {
            shareModel.sharedSubFiles(req.params.id, (err, files) => {
                res.render('shared/show', {
                    shared: shared,
                    files: files
                })
            })
        } else {
            shareModel.sharedSubFolders(shared._id, (folders) => {
                shareModel.sharedSubFiles(shared._id, (err, files) => {
                        res.render('shared/show', {
                        shared: shared,
                        sharedId:shared._id,
                        folders: folders,
                        files: files,
                    })
                })
            });
        }
    })
});

module.exports = router;