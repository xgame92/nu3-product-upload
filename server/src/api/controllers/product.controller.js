const httpStatus = require('http-status');
const {omit} = require('lodash');
const File = require('../models/file.model');
var path = require('path');
var fs = require('fs');
const APIError = require('../utils/APIError');

/**
 * Upload Product xml or inventory csv files
 * @public
 */
exports.upload = async (req, res, next) => {
    try {

        var filePath = path.join(__dirname, '../../..', '/uploads/' + req.file.filename);
        var mimeType = req.file.mimetype;
        var fileName = req.file.filename;
        var originalFileName = req.file.originalname;

        var fileObject = new File({
            originalFileName: originalFileName,
            fileName: fileName,
            mimeType: mimeType,
            file: {
                data: fs.readFileSync(filePath),
                contentType: mimeType
            }
        });

        // TODO Save xml or csv file and do the logic

        File.create(fileObject, (err, item) => {
            if (err) {
                console.log(err.message);
            } else {
                // Remove uploaded file from server
                fs.unlinkSync(filePath)
            }
        });


        res.status(httpStatus.CREATED);
        res.json({status: 'OK'});
    } catch (error) {
        next(new APIError({
            message: error.message,
            status: error.status,
        }));
    }
};