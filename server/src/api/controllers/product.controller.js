const httpStatus = require('http-status');
const {omit, map} = require('lodash');
const File = require('../models/file.model');
const Product = require('../models/product.model');
const Inventory = require('../models/inventory.model');
const path = require('path');
const fs = require('fs');
const APIError = require('../utils/APIError');
const parser = require('xml2json');
const csv = require('csvtojson')
const {MapToProductObject} = require('../utils/ProductMapper')
/**
 * Upload Product xml or inventory csv files
 * @public
 */
exports.upload = async (req, res, next) => {
    try {

        const filePath = path.join(__dirname, '../../..', '/uploads/' + req.file.filename);
        const mimeType = req.file.mimetype;
        const fileName = req.file.filename;
        const originalFileName = req.file.originalname;

        const fileObject = new File({
            originalFileName: originalFileName,
            fileName: fileName,
            mimeType: mimeType,
            file: {
                data: fs.readFileSync(filePath),
                contentType: mimeType
            }
        });

        if (mimeType === 'application/xml' || mimeType === 'text/xml') {

            fs.readFile(filePath, function (err, data) {

                let jsonProductsObject = JSON.parse(parser.toJson(data, {reversible: true}));

                const mappedProductsData = MapToProductObject(jsonProductsObject.products.product);

                mappedProductsData.forEach(product => {
                    Product.updateOne({id: product.id}, product, {upsert: true, setDefaultsOnInsert: true}).exec();
                });

            });
        }

        if (mimeType === 'text/csv' || mimeType === 'application/vnd.ms-excel') {
            // TODO add or update Inventory csv data
            const jsonArray = await csv({
                trim: true,
                output: 'json',
                delimiter: [";"]
            }).fromFile(filePath);

            jsonArray.forEach(inventory => {
                inventory.amount = inventory.amount.replace(',','.');
                Inventory.updateOne(
                    {
                        handle: inventory.handle,
                        location: inventory.location
                    },
                    inventory,
                    {
                        upsert: true,
                        setDefaultsOnInsert: true
                    }).exec();
            });
        }

        await File.create(fileObject, (err) => {
            if (err) {
                throw new APIError({
                    message: err.message,
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

/**
 * Get Uploaded File
 * @public
 */
exports.uploadedFile = async (req, res, next) => {
    try {

        let {fileName} = req.params;

        const file = await File.findOne({fileName});

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


