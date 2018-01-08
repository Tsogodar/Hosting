const express = require('express');
const router = express.Router();
const folderModel = require('../models/Folder');
const fileModel = require('../models/File');
const {authenticated} = require('../helpers/authenticated');

router.get('/', authenticated, (req, res) => {
    folderModel.findFolders(req.user.email, null, (folders) => {
        fileModel.findFiles(req.user.email, null, (error, files) => {
            let countFiles = files.length;
            for (key in files) {
                files[key].count=countFiles;
                if (files[key].filename.length > 19) {
                    files[key].filenameShort = `${files[key].filename.substring(0, 15)}...`;
                } else {
                    files[key].filenameShort = files[key].filename;
                }
            }
            for (key in folders) {
                if (folders[key].name.length > 11) {
                    folders[key].name = `${folders[key].name.substring(0, 11)}...`;
                }
            }
            res.render('main/show', {
                config: req.user.config,
                folders: folders,
                files: files
            })
        })
    });
});

module.exports = router;