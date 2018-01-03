const mongoose = require('mongoose');
const gridFsStream = require('gridfs-stream');
const gfs = gridFsStream(mongoose.connection.db, mongoose.mongo);
const userModel = require('./User');

module.exports = {

    //instance of model
    gfs: gfs,

    //find files
    findFiles: (owner, parent, callback) => {
        gfs.files.find({
            'metadata.owner.email': owner,
            'metadata.parent': parent,
        }).toArray(callback);
    },

    //load file
    loadFile: (fileId) => {
        return gfs.createReadStream({
            _id: fileId
        });
    },

    //remove file
    removeFile: (fileId, email, callback) => {
        gfs.files.findOne({
            _id: mongoose.Types.ObjectId(fileId)
        }, (err, file) => {
            let size = file.length;
            userModel.checkIfExists(email, (user) => {
                let addSpace = parseInt(user.freeSpace) + parseInt(size);
                userModel.changeFreeSpace(email, addSpace, (change => {
                    gfs.remove({
                        _id: mongoose.Types.ObjectId(fileId)
                    }, callback)
                }))
            })
        });
    },

    //download file
    downloadFile: (fileId, callback) => {
        gfs.files.findOne({
            _id: mongoose.Types.ObjectId(fileId),
        }, callback);
    },

    //Find files copies
    fileCopies: (filename, parent, callback) => {
        gfs.files.find({
            filename: filename,
            'metadata.parent': {
                $eq: parent
            }
        }).toArray(callback)
    },

    //reset copies if unique name
    resetCopies: (fileName, callback) => {
        gfs.files.update({
            filename: fileName
        }, {
            $set: {
                'metadata.copies': null
            }
        }).then(callback);
    },

    //rename folder
    renameFile: (renamedId, newName, callback) => {
        gfs.files.update({
            _id: mongoose.Types.ObjectId(renamedId)
        }, {
            $set: {
                filename: newName,
            }
        }).then((updated) => {
            gfs.files.findOne({
                _id: mongoose.Types.ObjectId(renamedId)
            }, (err, file) => {
                module.exports.fileCopies(newName, file.metadata.parent, ((err,copies) => {
                    console.log(copies.length)
                    if (copies.length === 1) {
                        module.exports.resetCopies(newName, callback)
                    } else {
                        gfs.files.update({
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
};
