const express = require('express');
const router = express.Router();
const folderModel = require('../models/Folder');
const {checkFolderName} = require('../helpers/checkFolderName');


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

router.get('/:id', (req, res) => {
    if (req.xhr) {
        folderModel.xhr(req.params.id, (folder => {
            res.json(folder)
        }));
    } else {
        folderModel.openFolder(req.params.id, 'cinek', (folders => {
            folderModel.openedFolder(req.params.id, (openedFolder) => {
                // folderModel.findParents(req.params.id, (parents) => {
                folderModel.findAllFolders('cinek', (allFolders) => {
                    res.render('files/show', {
                        folders: folders,
                        openedFolder: openedFolder,
                        parent: req.params.id,
                        allFolders: allFolders,
                    });
                })
                // });
            })
        }))
    }
});

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

router.get('/remove/:id', (req, res) => {
    folderModel.removeFolder(req.params.id, (deleted) => {
        if (deleted) {
            // if (req.params.parent !== undefined) {
            //     res.redirect(`/folder/${req.params.parent}`);
            // } else {
            //     res.redirect('/');
            // }
                res.redirect('back');
        }
    });
});

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

module.exports = router;