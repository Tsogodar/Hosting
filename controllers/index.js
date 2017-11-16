const express = require('express');
const router = express.Router();
const folderModel = require('../models/Folder');

router.get('/', (req, res) => {
    folderModel.findFolders('cinek', null, (folders) => {
            res.render('files/show', {
                folders: folders,
            })
    });
});

module.exports = router;