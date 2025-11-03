const product_controller = require('../Controller/product_controller');
const auth = require ('../Middleware/authMiddleware');
const role = reuire('../Middleware/roleMiddleware');
const express = require ('express');
const router = express.Router();

router.post('/api/product',auth,role(seller),product_controller);
router.get('/api/products',auth,product_controller.list_products);
router.get('/api/products/:id',auth,product_controller.get_product_id);
router.put('/api/products/:id',auth,role(seller),product_controller.update_product);
router.delete('/api/products/:id',auth,role(seller),product_controller.delete_product);

