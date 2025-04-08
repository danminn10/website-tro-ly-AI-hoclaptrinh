const express = require('express');
const UserController = require('../controllers/UserController');
const authenticateJWT = require('../middlewares/AuthMiddleware');

const router = express.Router();

// Routes cho người dùng (yêu cầu xác thực)
router.get('/', UserController.getAllUsers);
router.get('/:id', UserController.getUserById);
router.put('/:id', UserController.updateUser);

module.exports = router;
