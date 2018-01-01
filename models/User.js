const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const fileModel = require('./File');
const moment = require('moment');

moment.locale('pl');

const UserSchema = new Schema({
    name: String,
    surname: String,
    email: String,
    password: String,
    freeSpace: {
        type: String,
        default: '104857600'
    },
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
            mode: 'grid',
            theme: {
                dark: {
                    set: false,
                    value: 'off'
                }
            }
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
    },

    updateName: (email, newName, callback) => {
        User.update({
            email: email
        }, {
            $set: {
                name: newName
            }
        }, callback);
    },

    updateSurname: (email, newSurname, callback) => {
        User.update({
            email: email
        }, {
            $set: {
                surname: newSurname
            }
        }, callback);
    },

    updateEmail:(oldEmail,newEmail,callback)=>{
        User.update({
            email: oldEmail
        }, {
            $set: {
                email: newEmail
            }
        }, (emailChanged)=>{
            fileModel.gfs.files.update({
                'metadata.owner.email': oldEmail,
            }, {
                $set: {
                    'metadata.owner.email': newEmail
                }
            }).then(callback)
        });
    },

    updateTheme: (email, newTheme, switchValue, callback) => {
        User.update({
            email: email
        }, {
            $set: {
                'config.theme.dark.set': newTheme,
                'config.theme.dark.value': switchValue,
            }
        }, callback);
    },

    changeFreeSpace:(email,newSpace,callback)=>{
        User.update({
            email: email
        }, {
            $set: {
                freeSpace:newSpace
            }
        }, callback);
    }
};

console.log(module.exports.User);