let mongoose = require('mongoose');

let fileSchema = new mongoose.Schema({
    originalFileName: String,
    fileName: String,
    mimeType: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    file: {
        data: Buffer,
        contentType: String
    }
});

fileSchema.statics = {};

/**
 * @typedef File
 */
module.exports = mongoose.model('File', fileSchema);
