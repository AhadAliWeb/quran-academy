const express = require('express');
const {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  addBulkStudents,
  getMe,
  unApprovedUsers,
  approveUser,
} = require( '../controllers/userController.js');
const { protect, authorizePermissions } = require('../middleware/authMiddleware.js');

const router = express.Router();

router.post('/', registerUser);
router.post('/auth', authUser);
router.post('/logout', logoutUser);
router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router.get('/all-users', getAllUsers)

router.get("/me", protect, getMe)

router.get("/unapproved", protect, authorizePermissions("admin"), unApprovedUsers)

router.get("/abs", addBulkStudents)

router.get("/approve/:userId", protect, authorizePermissions("admin"), approveUser)

module.exports = router;
