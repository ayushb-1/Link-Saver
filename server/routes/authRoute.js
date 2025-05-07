const express = require('express');
const router = express.Router();
const { registerUser, loginUser} = require('../controller/authController');
// const { protect } = require('../middleware/authMiddleware');

router.post('/signup', registerUser);
router.post('/login', loginUser);
// router.route('/profile').get(protect, getUserProfile);

module.exports = router;