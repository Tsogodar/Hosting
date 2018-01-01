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
            console.log(userModel.User)
            let size = file.length;
            userModel.checkIfExists(email, (user) => {
                let addSpace = parseInt(user.freeSpace) + parseInt(size);
                console.log(addSpace)
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
    }
};
