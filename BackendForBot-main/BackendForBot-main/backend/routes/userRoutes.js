const express = require('express');
const router = express.Router();
const {
  getUsers,
  deleteUser,
  updateUser,
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

// All routes here are protected and admin-only
router.use(protect);
router.use(admin);

router.route('/').get(getUsers);

router.route('/:id')
  .delete(deleteUser)
  .put(updateUser);

module.exports = router;