const express = require('express');
const router = express.Router();
const {
  getProfile,
  upsertProfile,
  addContact,
  removeContact,
  getProfileByUserId,
} = require('../controllers/health.controller');
const { protect } = require('../middleware/auth.middleware');
const { roleGuard } = require('../middleware/role.middleware');

// FR-04: Patient manages own health profile
router.get('/', protect, roleGuard('patient'), getProfile);
router.put('/', protect, roleGuard('patient'), upsertProfile);

// FR-05: Patient manages emergency contacts
router.post('/contacts', protect, roleGuard('patient'), addContact);
router.delete('/contacts/:contactId', protect, roleGuard('patient'), removeContact);

// FR-07: Responder views patient profile during response
router.get('/patient/:userId', protect, roleGuard('responder', 'admin'), getProfileByUserId);

module.exports = router;
