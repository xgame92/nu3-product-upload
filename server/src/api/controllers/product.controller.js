const httpStatus = require('http-status');
const {omit, map, omitBy, isNil} = require('lodash');
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
                throw new APIError({
                    message: 'Internal Server Error',
                    status: httpStatus.INTERNAL_SERVER_ERROR,
                });
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

/**
 * Get Uploaded Files
 * @public
 */
exports.uploadedFiles = async (req, res, next) => {
    try {
        File.find({}, function (err, result) {
            if (err) {
                throw new APIError({
                    message: 'Internal Server Error',
                    status: httpStatus.INTERNAL_SERVER_ERROR,
                });
            } else {
                const files = map(result, (file) => omit(file.toObject(), ['_id', 'file', '__v']));
                res.status(httpStatus.OK);
                res.json(files);
            }
        });
    } catch (error) {
        next(new APIError({
            message: error.message,
            status: error.status,
        }));
    }
};


exports.uploadedFile = async (req, res, next) => {
    try {

        let {fileName} = req.params;

        const file =  await File.findOne({fileName});

        res.writeHead(httpStatus.OK, {
            'Content-Type': file.mimeType,
            'Content-disposition': 'attachment;filename=' + file.originalFileName,
            'Content-Length': file.file.data.length
        });

        res.end(Buffer.from(file.file.data, 'binary'));
    } catch (error) {
        next(new APIError({
            message: error.message,
            status: error.status,
        }));
    }
};
