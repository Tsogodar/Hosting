const mongoose = require('mongoose');
const folderModel=require('../models/Folder');
const fileModel=require('../models/File');

module.exports={

    //find info about shared folder
    sharedFolder:(sharedLink,callback)=>{
        folderModel.Folder.findOne({
            sharedLink:sharedLink
        }).then(callback)
    },

    //find folders inside shared folder
    sharedSubFolders:(folderId,callback)=>{
        folderModel.Folder.find({
            parent:folderId
        }).then(callback);
    },

    //find files inside shared folder
    sharedSubFiles:(folderId,callback)=>{
        fileModel.gfs.files.find({
            'metadata.parent': folderId.toString(),
        }).toArray(callback);
    },
};