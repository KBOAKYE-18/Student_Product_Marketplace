const product_controller = require('../Controller/product_controller');
const auth = require ('../Middleware/authMiddleware');
const role = require('../Middleware/roleMiddleware');
const express = require ('express');
const router = express.Router();

router.post('/',auth,role('seller'),product_controller.add_product);
router.get('/',auth,product_controller.list_products);
router.get('/:id',auth,product_controller.get_product_id);
router.put('/:id',auth,role('seller'),product_controller.update_product);
router.delete('/:id',auth,role('seller'),product_controller.delete_product);
router.get('/browse/:category',auth,product_controller.get_product_by_category);

module.exports = router;
