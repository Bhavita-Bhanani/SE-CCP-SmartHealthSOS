const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  setUserActiveStatus,
  changeUserRole,
  deleteUser,
  getAllAlerts,
} = require('../controllers/admin.controller');
const { protect } = require('../middleware/auth.middleware');
const { roleGuard } = require('../middleware/role.middleware');

// All admin routes require authentication + admin role (FR-03, FR-08, FR-09)
router.use(protect, roleGuard('admin'));

router.get('/users', getAllUsers);                          // FR-08
router.patch('/users/:userId/status', setUserActiveStatus); // FR-08
router.patch('/users/:userId/role', changeUserRole);        // FR-08
router.delete('/users/:userId', deleteUser);                // FR-08
router.get('/alerts', getAllAlerts);                        // FR-09

module.exports = router;
