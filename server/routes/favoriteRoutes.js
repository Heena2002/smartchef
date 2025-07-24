const express = require('express');
const {
  addFavorite,
  removeFavorite,
  getFavorites
} = require('../controllers/favoriteController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// ➕ Add a favorite recipe (needs JWT token)
router.post('/add', authMiddleware, addFavorite);        // POST   /api/favorites/add

// ❌ Remove a favorite by recipe ID
router.delete('/:id', authMiddleware, removeFavorite);   // DELETE /api/favorites/:id

// 📋 Get all favorites for the logged-in user
router.get('/', authMiddleware, getFavorites);           // GET    /api/favorites

module.exports = router;