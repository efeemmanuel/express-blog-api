const { Router } = require('express');
const adminController = require('../controllers/admin.controllers.js');
const { authenticate } = require('../middlewares/auth.middleware');
const { permit } = require('../middlewares/permission.middleware');

const router = Router();


router.get('/users', authenticate, permit('manage_users'), adminController.fetchUser)

router.get('/:id/users', authenticate, permit('manage_users'), adminController.fetchUserId)


module.exports = router;