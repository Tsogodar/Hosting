const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const FolderSchema = new Schema({
    owner: String,
    name: String,
    shared: String,
    sharedLink: String,
    sharedDate: String,
    parent: String,
    copies: String

});

const Folder = module.exports = mongoose.model('folder', FolderSchema);

module.exports = {

    //add new folder
    addFolder: (newFolder, callback) => {
        new Folder(newFolder).save(callback);
    },

    //find copies of folder
    folderCopies: (folderName, parent, callback) => {
        Folder.find({
            name: folderName,
            parent: {
                $eq: parent
            }
        }).then(callback)
    },

    //set copies if unique name
    resetCopies: (folderName, callback) => {
        Folder.update({
            name: folderName
        }, {
            $set: {
                copies: null
            }
        }).then(callback);
    },

    //find folders without parents
    findFolders: (owner, parent, callback) => {
        Folder.find({
            owner: owner,
            parent: parent
        }).then(callback);
    },

    //find all user folders
    findAllFolders: (owner, callback) => {
        Folder.find({
            owner: owner,
        }).then(callback);
    },

    //change destination via context menu
    level: (folderId, callback) => {
        Folder.find({
            _id: {
                $ne: folderId
            },
            parent: {
                $ne: folderId
            }
        }).then(callback)
    },

    // info about opened folder
    openedFolder: (folderId, callback) => {
        return Folder.find({
            _id: folderId
        }).then(callback);
    },

    //find content of opened folder
    openFolder: (folderId, owner, callback) => {
        Folder.find({
            parent: folderId,
            owner: owner
        }).then(callback);
    },

    //move folder to another location
    moveFolder: (movedId, moveTo, callback) => {
        Folder.update({
            _id: moveTo
        }, {
            $set: {
                parent: movedId
            }
        }, Folder.find({
            _id: movedId
        }).then((folder) => {
            Folder.find({
                _id: moveTo
            }).then((folder2) => {
                module.exports.folderCopies(folder2[0].name, folder2[0].parent, (copies => {
                    if (copies.length === 1) {
                        module.exports.resetCopies(folder2[0].name);
                    } else {
                        Folder.update({
                                _id: moveTo
                            }, {
                                $set: {
                                    copies: copies.length,
                                }
                            }, (updated) => {
                            }
                        )
                    }
                }))
            });
        }), callback)
    },

    //remove folder and subfolders
    removeFolder: (folderId, callback) => {
        Folder.find({parent: folderId}).then((childrens) => {
                childrens.forEach((child) => {
                    module.exports.removeFolder(child._id)
                });
                childrens.forEach((child) => {
                    Folder.remove({_id: child._id});
                });
                Folder.remove({_id: folderId}).then(callback)
            }
        )
    },

    //rename folder
    renameFolder: (renamedId, newName, callback) => {
        Folder.update({
            _id: renamedId
        }, {
            $set: {
                name: newName,
            }
        }).then(() => {
            Folder.find({
                _id: renamedId
            }).then((folder) => {
                module.exports.folderCopies(newName, folder[0].parent, (copies => {
                    if (copies.length === 1) {
                        module.exports.resetCopies(newName, callback)
                    } else {
                        Folder.update({
                            _id: renamedId
                        }, {
                            $set: {
                                copies: copies.length,
                            }
                        }).then(callback)
                    }
                }))
            });
        });
    },

    //xhr call for context menu
    xhr: (folderId, callback) => {
        module.exports.level(folderId, callback)
    }
};