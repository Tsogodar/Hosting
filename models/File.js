const mongoose = require('mongoose');
const gridFsStream = require('gridfs-stream');
const gfs = gridFsStream(mongoose.connection.db, mongoose.mongo);

module.exports = {

    //instance of model
    gfs:gfs,

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
    removeFile: (fileId) => {
        gfs.remove({
            _id: mongoose.Types.ObjectId(fileId)
        })
    },

    //download file
    downloadFile: (fileId,callback) => {
        gfs.files.findOne({
            _id:mongoose.Types.ObjectId(fileId),
        },callback);
    }
};
