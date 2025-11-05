const user_controller = require('../Controller/user_controller');
const auth = require ('../Middleware/authMiddleware')
const express = require ('express');
const router = express.Router();

router.post('/register',user_controller.add_user);
router.post('/delete/user',auth,user_controller.delete_user);
router.post('/login',user_controller.login_user);

module.exports = router;
