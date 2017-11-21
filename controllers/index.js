const express = require('express');
const router = express.Router();
const folderModel = require('../models/Folder');
const fileModel = require('../models/File');

router.get('/', (req, res) => {
    folderModel.findFolders('cinek', null, (folders) => {
        fileModel.findFiles('cinek',null,(error,files)=>{
            res.render('main/show', {
                folders: folders,
                files:files
            })
        })
    });
});

module.exports = router;