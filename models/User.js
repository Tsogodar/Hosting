const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment');

moment.locale('pl');

const UserSchema = new Schema({
    name: String,
    surname: String,
    email: String,
    password: String,
    registered: {
        type: String,
        default: moment().format('D MMMM YYYY,HH:mm:ss')
    },
    lastLogin: {
        type: String,
        default: 'Nigdy'
    },
    group: {
        type: String,
        default: 'common'
    },
    googleID: {
        type: String,
        default: null
    },
    config: {
        type: Object,
        default: {
            mode: 'grid'
        }
    }
});

const User = mongoose.model('user', UserSchema);

module.exports = {

    User: User,

    checkIfExists: (email, callback) => {
        User.findOne({
            email: email
        }).then(callback)
    }
}