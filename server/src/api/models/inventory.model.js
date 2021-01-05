let mongoose = require('mongoose');

let inventorySchema = new mongoose.Schema({
    handle: {
        type: "String",
        required: true,
        index: true,
    },
    location: {
        type: "String",
        required: true,
        index: true,
    },
    amount: {
        type: "Number",
        required: true
    }
});

inventorySchema.statics = {};

/**
 * @typedef Inventory
 */
module.exports = mongoose.model('Inventory', inventorySchema);
