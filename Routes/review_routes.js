const review_controller = require('../Controller/review_controller');
const auth = require ('../Middleware/authMiddleware');
const express = require ('express');
const router = express.Router();

router.post('/',auth,review_controller.add_review);
router.get('/:sellerid',auth,review_controller.view_reviews);

module.exports = router;