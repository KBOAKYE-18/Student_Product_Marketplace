const review_controller = require('../Controller/review_controller');
const auth = require ('../Middleware/authMiddleware');
const role = require('../Middleware/roleMiddleware');
const express = require ('express');
const router = express.Router();

router.post('/:product_id',auth,role('buyer'),review_controller.add_review);
router.get('/',auth,review_controller.view_reviews);

module.exports = router;