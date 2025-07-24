const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

// ✅ Test route
router.get('/test', (req, res) => {
  res.json({ msg: "API working fine ✅" });
});

// ✅ User registration route
router.post('/register', register); // use your controller function

// ✅ User login route
router.post('/login', login);

module.exports = router;
