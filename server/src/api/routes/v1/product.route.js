const express = require('express');
const productController = require('../../controllers/product.controller');
const httpStatus = require('http-status');
const APIError = require('../../utils/APIError');

let multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        if (!(file.mimetype === 'application/xml' || file.mimetype === 'text/csv')) {

            cb(new APIError({
                message: 'Unsupported Media Type',
                status: httpStatus.UNSUPPORTED_MEDIA_TYPE,
            }));

        } else {

            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, uniqueSuffix + '-' + file.originalname)

        }
    }
});

const upload = multer({storage: storage})

const router = express.Router();

router.route('/upload')
    .post(upload.single('file'), productController.upload);

router.route('/files')
    .get(productController.uploadedFiles);

router.route('/file/:fileName')
    .get(productController.uploadedFile);

module.exports = router;
