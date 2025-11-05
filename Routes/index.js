const express = require('express');
const router = express.Router();

const productRoutes = require('./product_routes');
const userRoutes = require('./user_routes');
const orderRoutes = require('./order_routes');
const reviewRoutes = require('./review_routes');

router.use('/api/products', productRoutes);
router.use('/api/user', userRoutes);
router.use('/api/orders', orderRoutes);
router.use('/api/reviews', reviewRoutes);

module.exports = router;
