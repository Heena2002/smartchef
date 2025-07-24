const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // 🔐 Link to User
    required: true
  },
  recipeId: {
    type: Number, // Recipe ID from Spoonacular
    required: true
  },
  title: String,
  image: String,
  sourceUrl: String
}, { timestamps: true });
favoriteSchema.index({user:1,recipeId:1},{unique:true});

module.exports = mongoose.model('Favorite', favoriteSchema);