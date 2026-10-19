const express = require('express');
const router = express.Router();
const { isAuthenticated, isAdmin } = require('../middleware/auth');
const {
  getDashboard,
  searchUser,
  createPost,
  deletePost,
  showCreatePost,
} = require('../controllers/adminController');

router.use(isAuthenticated, isAdmin);

router.get('/dashboard', getDashboard);
router.get('/search-user', searchUser);
router.get('/create-post', showCreatePost);
router.post('/create-post', createPost);
router.post('/delete-post/:id', deletePost);

module.exports = router;
