const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose')

/**
 * User Schema
 * @private
 */
const userSchema = new mongoose.Schema({
    id: {
        type: "Number",
        required: true,
        index: true,
    },
    userName: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 128,
    },
    name: {
        type: String,
        maxlength: 128,
        index: true,
        trim: true,
    },
    services: {
        facebook: String,
        google: String,
        github: String
    },
    picture: {
        type: String,
        trim: true,
    },
}, {
    timestamps: true,
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */


/**
 * Methods
 */
userSchema.method({
});

/**
 * Statics
 */
userSchema.statics = {
}

userSchema.plugin(passportLocalMongoose, { usernameField: 'userName' })

/**
 * @typedef User
 */
module.exports = mongoose.model('User', userSchema)
