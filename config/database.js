const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

module.exports = {
    connect: () => {
        if (process.env.NODE_ENV === 'production') {
            return mongoose.connect(`mongodb://${process.env.dbLogin}:${process.env.dbPass}@ds111066.mlab.com:11066/dyplo-prod`).then(() => {
                console.log('MongoDB connected mLab');
            }).catch(err => console.log(err))
        } else {
            return mongoose.connect(`mongodb://localhost/dyplo2`).then(() => {
                console.log('MongoDB connected local');
            }).catch(err => console.log(err))
        }
    },
    url: () => {
        if (process.env.NODE_ENV === 'production') {
            return `mongodb://${process.env.dbLogin}:${process.env.dbPass}@ds111066.mlab.com:11066/dyplo-prod`;
        } else {
            return `mongodb://localhost/dyplo2`;
        }
    }
};