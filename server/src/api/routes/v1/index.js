const express = require('express');
const router = express.Router();
const productRoutes = require('./product.route');


/**
 * GET v1/status
 */
router.get('/status', (req, res) => res.send('OK'));

router.use('/products', productRoutes);

module.exports = router;
