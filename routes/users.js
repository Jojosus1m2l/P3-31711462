const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { updateUserValidation } = require('../middleware/validators');
const { auth, admin } = require('../middleware/auth');

// @route   GET /api/users
// @desc    Get all users
// @access  Private/Admin
router.get('/', [auth, admin], userController.getUsers);

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Private/Admin or Own User
router.get('/:id', auth, userController.getUser);

// @route   POST /api/users
// @desc    Create a user (Admin only)
// @access  Private/Admin
router.post('/', [auth, admin, updateUserValidation], userController.createUser);

// @route   PUT /api/users/:id
// @desc    Update user
// @access  Private/Admin or Own User
router.put('/:id', [auth, updateUserValidation], userController.updateUser);

// @route   DELETE /api/users/:id
// @desc    Delete user
// @access  Private/Admin or Own User
router.delete('/:id', auth, userController.deleteUser);

module.exports = router;
