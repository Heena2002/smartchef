// models/User.js

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },

  password: {
    type: String,
    required: true
  },

  /*favorites: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Recipe'  // ✅ Change to 'Favorite' if your model is Favorite.js
    }
  ]*/
}, 
{timestamps: true });

module.exports = mongoose.model('User', userSchema);