const multer = require('multer');
const db = require('./database');
const gridFsStorage = require('multer-gridfs-storage');

const storage=new gridFsStorage({
    url: db.url(),
    file: (req, file) => {
        return {
            filename:file.originalname,
            metadata:{
                owner: 'cinek',
                shared: false,
                sharedLink: null,
                sharedDate: null,
                parent: parent = (req.params.parent == 'undefined' ? 'null' : req.params.parent)
            }
        };
    }
});

let upload = multer({
    storage: storage,
    limits: {
        fileSize: 1073741824
    }
}).array('fileToUpload', 100);

module.exports = upload;