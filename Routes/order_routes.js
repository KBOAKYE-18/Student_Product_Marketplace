const order_controller = require('../Controller/order_controller');
const auth = require ('../Middleware/authMiddleware');
const role = require('../Middleware/roleMiddleware');
const express = require ('express');
const router = express.Router();

router.post('/',auth,role('buyer'),order_controller.place_order);
router.get('/',auth,role('admin'),order_controller.review_orders);
router.get('/:id',auth,role('admin'),order_controller.review_orders_id);

module.exports = router;


