const Favorite = require('../models/Favorite');

// ✅ Add Favorite
exports.addFavorite = async (req, res) => {
  const userId = req.user.id;
  const { recipeId, title, image, sourceUrl } = req.body;

  try {
    // Check if already exists
    const exists = await Favorite.findOne({ user: userId, recipeId });
    if (exists) {
      return res.status(400).json({ message: 'Already in favorites' });
    }

    // Create new favorite
    const favorite = new Favorite({
      user: userId,
      recipeId,
      title,
      image,
      sourceUrl
    });

    await favorite.save();
    res.status(201).json({ message: 'Added to favorites' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};



// ✅ Remove Favorite
exports.removeFavorite = async (req, res) => {
  const userId = req.user.id;
  const recipeId = req.params.id;

  try {
    await Favorite.findOneAndDelete({ user: userId, recipeId });
    res.status(200).json({ message: 'Removed from favorites' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};



// ✅ Get All Favorites
exports.getFavorites = async (req, res) => {
  const userId = req.user.id;

  try {
    const favorites = await Favorite.find({ user: userId });
    res.status(200).json(favorites);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};