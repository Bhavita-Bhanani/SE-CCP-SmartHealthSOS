const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/register', register); // FR-01
router.post('/login', login);       // FR-02
router.get('/me', protect, getMe);  // Get current user info

module.exports = router;
