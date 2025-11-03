const order_controller = require('../Controller/order_controller');
const auth = require ('../Middleware/authMiddleware');
const role = reuire('../Middleware/roleMiddleware');
const express = require ('express');
const router = express.Router();

router.post('/api/orders',auth,role(buyer),order_controller.place_order);
router.get('/api/orders',auth,role(admin),order_controller.review_orders);
router.get('/api/orders/:id',auth,role(admin),order_controller.review_orders_id);


