const user_controller = require('../Controller/user_controller');
const auth = require ('../Middleware/authMiddleware')
const express = require ('express');
const router = express.Router();

router.post('/api/auth/register',user_controller.add_user);
router.post('/api/auth/delete/user',auth,user_controller.delete_user);
router.post('/api/auth/login',user_controller.login_user);
