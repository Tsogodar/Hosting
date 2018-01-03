const express = require('express');
const router = express.Router();
const folderModel = require('../models/Folder');
const fileModel = require('../models/File');
const {checkFolderName} = require('../helpers/checkFolderName');
const {authenticated} = require('../helpers/authenticated');

//add new folder
router.post('/add/:parent?', checkFolderName,authenticated, (req, res) => {
    let newFolder = {
        owner: req.user.email,
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
router.get('/:id',authenticated, (req, res) => {
    if (req.xhr) {
        folderModel.xhr(req.params.id, (folder => {
            res.json(folder)
        }));
    } else {
        folderModel.openFolder(req.params.id, req.user.email, (folders => {
            folderModel.openedFolder(req.params.id, (openedFolder) => {
                folderModel.findAllFolders(req.user.email, (allFolders) => {
                    fileModel.findFiles(req.user.email, req.params.id, (error, files) => {
                        res.render('main/show', {
                            folders: folders,
                            openedFolder: openedFolder,
                            parent: req.params.id,
                            allFolders: allFolders,
                            files: files,
                            config:req.user.config,
                        });
                    });
                })
            })
        }))
    }
});

//move folder via drag&drop
router.post('/move/:movedId/:moveTo',authenticated, (req, res) => {
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
router.get('/remove/:id',authenticated, (req, res) => {
    folderModel.removeFolder(req.params.id, (deleted) => {
        if (deleted) {
            res.redirect('back');
        }
    });
});

//rename folder
router.post('/rename/:id/:parent?',authenticated, (req, res) => {
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
router.post('/destination/:id',authenticated, (req, res) => {
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

module.exports = router;