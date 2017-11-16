module.exports = {
    checkFolderName: (req,res,next) => {
        if (req.body.newFolderName.trim().length === 0) {
            return res.redirect('/');
        } else {
            return next();
        }
    }
};