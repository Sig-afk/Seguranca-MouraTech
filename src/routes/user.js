const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/auth');
const { getDashboard } = require('../controllers/userController');

router.use(isAuthenticated);

router.get('/dashboard', getDashboard);

module.exports = router;
