const httpStatus = require('http-status');
const {omit, map} = require('lodash');
const File = require('../models/file.model');
const Product = require('../models/product.model');
const path = require('path');
const fs = require('fs');
const APIError = require('../utils/APIError');
const parser = require('xml2json');
const csv = require('csvtojson')
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

        // TODO Save xml or csv file and do the logic
        if (mimeType === 'application/xml') {

            fs.readFile(filePath, function (err, data) {

                let jsonProductsObject = JSON.parse(parser.toJson(data, {reversible: true}));

                const mappedProductsData = MapToProductObject(jsonProductsObject.products.product);

                mappedProductsData.forEach(product => {
                    Product.updateOne({id: product.id}, product, {upsert: true, setDefaultsOnInsert: true}).exec();
                });

            });
        }

        if (mimeType === 'text/csv') {
            // TODO add or update Inventory csv data
            const jsonArray = await csv({
                trim: true,
                output: 'json',
                delimiter: [";"]
            }).fromFile(filePath);

            /*var mappedCsv = map(jsonArray, (csvItem) => {
                csvItem.amount = parseFloat(csvItem.amount.replace(",", "."));
                Product.updateOne({handle: csvItem.handle}, {$set: {amount:  csvItem.amount}})
            });*/
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

function MapToProductObject(products) {
    return map(products, (product) => {
            return {
                id: product['id']['$t'],
                title: product['title']['$t'],
                bodyHtml: product['body-html']['$t'],
                vendor: product['vendor']['$t'],
                productType: product['product-type']['$t'],
                createdAt: product['created-at']['$t'],
                handle: product['handle']['$t'],
                publishedScope: product['published-scope']['$t'],
                tags: product['tags']['$t'],
                image: {
                    id: product['image']['id']['$t'],
                    productId: product['image']['product-id']['$t'],
                    createdAt: product['image']['created-at']['$t'],
                    updatedAt: product['image']['updated-at']['$t'],
                    alt: product.image?.alt?.nil,
                    width: product['image']['width']['$t'],
                    height: product['image']['height']['$t'],
                    src: product['image']['src']['$t'],
                }
            };
        }
    );
}
