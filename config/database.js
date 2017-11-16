const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

module.exports = {
    dbConnect: ()=>{
        if(process.env.NODE_ENV==='production'){
            mongoose.connect('mongodb://marcin:dyplo@ds111066.mlab.com:11066/dyplo-prod', {
                useMongoClient: true
            }).then(() => {
                console.log('MongoDB connected mLab');
            }).catch(err => console.log(err))
        } else{
            mongoose.connect('mongodb://localhost/dyplo2', {
                useMongoClient: true
            }).then(() => {
                console.log('MongoDB connected local');
            }).catch(err => console.log(err))
        }

    }
};