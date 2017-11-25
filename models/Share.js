const mongoose = require('mongoose');
const folderModel = require('../models/Folder');
const fileModel = require('../models/File');

module.exports = {

    //share resource
    share: (resourceId, callback) => {
        folderModel.Folder.findOne({
            _id: resourceId
        }).then((result) => {
            if (result === null) {
                fileModel.gfs.files.findOne({
                    _id: mongoose.Types.ObjectId(resourceId)
                }).then((result) => {
                    if (result === null) {
                        console.log('błąd udostępniania')
                    } else{
                        fileModel.gfs.files.update({
                            _id: mongoose.Types.ObjectId(resourceId)
                        }, {
                            $set: {
                                'metadata.shared': true,
                                'metadata.sharedDate': Date.now()
                            }
                        }).then(callback);
                    }
                })
            } else {
                folderModel.Folder.update({
                    _id: resourceId
                }, {
                    $set: {
                        'shared': true,
                        'sharedDate': Date.now()
                    }
                }).then(callback)
            }
        })
    },

    //unshare resource
    unshare: (resourceId, callback) => {
        folderModel.Folder.findOne({
            _id: resourceId
        }).then((result) => {
            if (result === null) {
                fileModel.gfs.files.findOne({
                    _id: mongoose.Types.ObjectId(resourceId)
                }).then((result) => {
                    console.log(result)
                    if (result === null) {
                        console.log('błąd udostępniania')
                    } else{
                        fileModel.gfs.files.update({
                            _id: mongoose.Types.ObjectId(resourceId)
                        }, {
                            $set: {
                                'metadata.shared': null,
                                'metadata.sharedDate': null
                            }
                        }).then(callback);
                    }
                })
            } else {
                folderModel.Folder.update({
                    _id: resourceId
                }, {
                    $set: {
                        'shared': null,
                        'sharedDate': null
                    }
                }).then(callback)
            }
        })
    },

    //find info about shared folder
    sharedFolder: (folderId, callback) => {
        folderModel.Folder.findOne({
            _id: folderId,
            shared: true
        }).then(callback)
    },

    //find folders inside shared folder
    sharedSubFolders: (resourceId, callback) => {
        folderModel.Folder.find({
            parent: resourceId
        }).then(callback);
    },

    //find files inside shared folder or files standalone
    sharedSubFiles: (resourceId, callback) => {
        fileModel.gfs.files.find({
            _id: mongoose.Types.ObjectId(resourceId),
            'metadata.shared': true,
        }).toArray(callback);
    },
};