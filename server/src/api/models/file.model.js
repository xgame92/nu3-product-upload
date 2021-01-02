var mongoose = require('mongoose');

var fileSchema = new mongoose.Schema({
    originalFileName: String,
    fileName: String,
    mimeType: String,
    file:
        {
            data: Buffer,
            contentType: String
        }
});

fileSchema.statics = {
};
/**
 * @typedef File
 */
module.exports = mongoose.model('File', fileSchema);
