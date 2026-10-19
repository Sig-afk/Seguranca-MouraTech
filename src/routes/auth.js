const express = require('express');
const router = express.Router();
const { showLogin, loginUser, logoutUser } = require('../controllers/authController');

router.get('/login', showLogin);
router.post('/login', loginUser);
router.get('/logout', logoutUser);

// Redireciona raiz para login
router.get('/', (req, res) => res.redirect('/login'));

module.exports = router;
