let mongoose = require('mongoose');

let productSchema = new mongoose.Schema({
    id: {
        type: "Number",
        required: true,
        index: true,
    },
    title: {
        type: "String"
    },
    bodyHtml: {
        type: "String"
    },
    vendor: {
        type: "String"
    },
    productType: {
        type: "String"
    },
    createdAt: {
        type: "Date"
    },
    handle: {
        type: "String"
    },
    publishedScope: {
        type: "String"
    },
    tags: {
        type: "String"
    },
    image: {
        id: {
            type: "Number"
        },
        productId: {
            type: "Number"
        },
        position: {
            type: "Number"
        },
        createdAt: {
            type: "Date"
        },
        updatedAt: {
            type: "Date"
        },
        alt: {
            type: "Boolean"
        },
        width: {
            type: "Number"
        },
        height: {
            type: "Number"
        },
        src: {
            type: "String"
        }
    }
});

productSchema.statics = {};

/**
 * @typedef Product
 */
module.exports = mongoose.model('Product', productSchema);
