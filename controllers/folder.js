const express = require('express');
const router = express.Router();
const folderModel = require('../models/Folder');
const fileModel = require('../models/File');
const domain=require('../config/domain').getDomain();
const shortId = require('shortid');
const {checkFolderName} = require('../helpers/checkFolderName');

//add new folder
router.post('/add/:parent?', checkFolderName, (req, res) => {
    let newFolder = {
        owner: "cinek",
        name: req.body.newFolderName,
        shared: null,
        sharedLink: null,
        sharedDate: null,
        parent: (req.params.parent === undefined ? null : req.params.parent),
        copies: null
    };
    folderModel.folderCopies(req.body.newFolderName, newFolder.parent, (copies => {
        if (copies.length > 0) {
            newFolder.copies = copies.length + 1;
        }
        folderModel.addFolder(newFolder, (err) => {
            if (err) {
                console.log(err);
            }
            if (req.params.parent !== undefined) {
                res.redirect(`/folder/${req.params.parent}`)
            } else {
                res.redirect('/');
            }
        });
    }));
});

//open folder
router.get('/:id', (req, res) => {
    if (req.xhr) {
        folderModel.xhr(req.params.id, (folder => {
            res.json(folder)
        }));
    } else {
        folderModel.openFolder(req.params.id, 'cinek', (folders => {
            folderModel.openedFolder(req.params.id, (openedFolder) => {
                folderModel.findAllFolders('cinek', (allFolders) => {
                    fileModel.findFiles('cinek', req.params.id, (error, files) => {
                        res.render('main/show', {
                            folders: folders,
                            openedFolder: openedFolder,
                            parent: req.params.id,
                            allFolders: allFolders,
                            files: files
                        });
                    });
                })
            })
        }))
    }
});

//move folder via drag&drop
router.post('/move/:movedId/:moveTo', (req, res) => {
    const move = {
        movedId: req.params.movedId,
        moveTo: req.params.moveTo
    };
    folderModel.moveFolder(move.movedId, move.moveTo, (err, moved) => {
        if (moved) {
            res.json(true);
        }
    })
});

//remove folder
router.get('/remove/:id', (req, res) => {
    folderModel.removeFolder(req.params.id, (deleted) => {
        if (deleted) {
            res.redirect('back');
        }
    });
});

//rename folder
router.post('/rename/:id/:parent?', (req, res) => {
    folderModel.renameFolder(req.params.id, req.body.renameInput, (renamed) => {
        if (renamed) {
            if (req.params.parent !== undefined) {
                res.redirect(`/folder/${req.params.parent}`);
            } else {
                res.redirect('/');
            }
        }
    });
});

//move folder via context menu
router.post('/destination/:id', (req, res) => {
    const move = {
        movedId: req.body.destination,
        moveTo: req.params.id
    };
    folderModel.moveFolder(move.movedId, move.moveTo, (err, moved) => {
        if (moved) {
            res.redirect('back');
        }
    })
});


//share folder
router.get('/share/:id', (req, res) => {
    let shareLink=shortId.generate();
    folderModel.share(req.params.id, shareLink, (shared) => {
        if(shared){
            req.flash('share_msg',`${domain.protocol}://${domain.name}/shared/${shareLink}`)
            res.redirect('back');
        }
    })
});

//unshare folder
router.get('/unshare/:id', (req, res) => {
    folderModel.unshare(req.params.id, (unshared) => {
        if(unshared){
            req.flash('unshare_msg',`Anulowano udostępnianie`)
            res.redirect('back');
        }
    })
});

module.exports = router;