const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

module.exports = {
    dbConnect: mongoose.connect('mongodb://localhost/dyplo2', {
        useMongoClient: true
    }).then(() => {
        console.log('MongoDB connected');
    }).catch(err => console.log(err))
};