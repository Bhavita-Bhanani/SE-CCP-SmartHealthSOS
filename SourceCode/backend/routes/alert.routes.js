const express = require('express');
const router = express.Router();
const {
  sendAlert,
  getActiveAlerts,
  acceptAlert,
  resolveAlert,
  getMyAlerts,
} = require('../controllers/alert.controller');
const { protect } = require('../middleware/auth.middleware');
const { roleGuard } = require('../middleware/role.middleware');

// FR-06: Patient sends SOS
router.post('/', protect, roleGuard('patient'), sendAlert);

// FR-07: Patient views own alert history
router.get('/mine', protect, roleGuard('patient'), getMyAlerts);

// FR-07: Responder views active alerts and manages them
router.get('/active', protect, roleGuard('responder', 'admin'), getActiveAlerts);
router.patch('/:alertId/accept', protect, roleGuard('responder'), acceptAlert);
router.patch('/:alertId/resolve', protect, roleGuard('responder'), resolveAlert);

module.exports = router;
