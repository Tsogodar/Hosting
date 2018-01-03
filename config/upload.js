const multer = require('multer');
const db = require('./database');
const moment = require('moment');
const gridFsStorage = require('multer-gridfs-storage');

const storage = new gridFsStorage({
    url: db.url(),
    file: (req, file) => {
        return {
            filename: file.originalname,
            metadata: {
                owner: {
                    email:req.user.email,
                    name:req.user.name,
                    surname:req.user.surname
                },
                shared: false,
                sharedDate: 'Nie',
                uploadDate: moment().format('D MMMM YYYY,HH:mm:ss'),
                parent: parent = (req.params.parent == 'undefined' ? 'null' : req.params.parent),
                copies:null
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