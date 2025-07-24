import React, { useState, useEffect, useRef, useCallback } from 'react';
import RecipeCard from '../components/RecipeCard';
import axios from '../api/axios';

function Home() {
  const [ingredients, setIngredients] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState([]);

  const [cuisine, setCuisine] = useState('');
  const [diet, setDiet] = useState('');
  const [maxTime, setMaxTime] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [searchHistory, setSearchHistory] = useState(() => {
    const saved = localStorage.getItem("searchHistory");
    return saved ? JSON.parse(saved) : [];
  });
  const [showSuggestions, setShowSuggestions] = useState(false);

  const inputRef = useRef();
  const apiKey = '470f055e86124a208c0145dca080b92d';

  const fetchRecipes = (queryText = ingredients) => {
    if (!queryText.trim()) {
      alert("⚠️ Please enter at least one ingredient.");
      return;
    }

    const updatedHistory = [queryText, ...searchHistory.filter(item => item !== queryText)];
    if (updatedHistory.length > 5) updatedHistory.pop();
    setSearchHistory(updatedHistory);
    localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));

    setLoading(true);
    setError('');
    setRecipes([]);

    let url = `https://api.spoonacular.com/recipes/complexSearch?query=${queryText}&number=6&addRecipeInformation=true&apiKey=${apiKey}`;
    if (cuisine) url += `&cuisine=${cuisine}`;
    if (diet) url += `&diet=${diet}`;
    if (maxTime) url += `&maxReadyTime=${maxTime}`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (data.results && data.results.length > 0) {
          const uniqueRecipes = [];
          const seenIds = new Set();

          for (const recipe of data.results) {
            if (!seenIds.has(recipe.id)) {
              uniqueRecipes.push(recipe);
              seenIds.add(recipe.id);
            }
          }

          setRecipes(uniqueRecipes);
        } else {
          setError("😓 No recipes found for the selected filters.");
        }
        setLoading(false);
      })
      .catch(() => {
        setError('❌ Failed to fetch recipes. Try again!');
        setLoading(false);
      });

    setShowSuggestions(false);
  };

  const fetchFavorites = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get('/api/favorites', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const favs = res.data;
      setFavoriteIds(favs.map(f => f.recipeId));
      if (showOnlyFavorites) {
        setRecipes(favs.map(fav => ({
          id: fav.recipeId,
          title: fav.title,
          image: fav.image,
          sourceUrl: fav.sourceUrl
        })));
      }
    } catch (err) {
      console.error('Failed to load favorites', err);
    }
  }, [showOnlyFavorites]);

  const toggleFavorite = async (recipe) => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Please login first!");

    const isFav = favoriteIds.includes(recipe.id);

    try {
      if (isFav) {
        await axios.delete(`/api/favorites/${recipe.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFavoriteIds(prev => prev.filter(id => id !== recipe.id));
      } else {
        await axios.post('/api/favorites/add', {
          recipeId: recipe.id,
          title: recipe.title,
          image: recipe.image,
          sourceUrl: `https://spoonacular.com/recipes/${recipe.title.replaceAll(' ', '-').toLowerCase()}-${recipe.id}`
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFavoriteIds(prev => [...prev, recipe.id]);
      }
    } catch (err) {
      console.error('❌ Favorite toggle failed', err);
      alert("⚠️ Something went wrong.");
    }
  };

  const visibleRecipes = recipes;

  const backgroundColor = darkMode ? '#1e1e1e' : '#fffaf0';
  const textColor = darkMode ? '#ffffff' : '#2E3A59';
  const cardBg = darkMode ? '#2c2c2c' : '#ffffff';

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setRecipes([]);
    if (showOnlyFavorites) {
      fetchFavorites();
    }
  }, [showOnlyFavorites, fetchFavorites]);

  return (
    <div style={{
      padding: '30px',
      fontFamily: 'Poppins, sans-serif',
      background: `linear-gradient(to right, ${backgroundColor}, ${darkMode ? '#2c2c2c' : '#ffe6e6'})`,
      color: textColor,
      minHeight: '100vh'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '32px', marginBottom: '20px', borderBottom: `4px solid #ff7043`, paddingBottom: '10px' }}>
          🍽️ SmartChef - AI Recipe Recommender
        </h2>
        <button onClick={() => setDarkMode(!darkMode)} style={{
          background: darkMode ? '#fff' : '#2E3A59',
          color: darkMode ? '#2E3A59' : '#fff',
          border: 'none',
          borderRadius: '10px',
          padding: '10px 20px',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}>
          {darkMode ? '🌞 Light Mode' : '🌙 Dark Mode'}
        </button>
      </div>

      <div ref={inputRef} style={{ position: 'relative', marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Enter ingredients or dish name..."
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          style={{
            padding: '12px',
            border: '1px solid #ccc',
            borderRadius: '10px',
            width: '300px'
          }}
        />
        {showSuggestions && searchHistory.length > 0 && (
          <ul style={{
            position: 'absolute',
            top: '45px',
            left: '0',
            width: '100%',
            background: '#fff',
            border: '1px solid #ccc',
            borderRadius: '8px',
            zIndex: 10,
            listStyle: 'none',
            padding: '5px',
            margin: '0'
          }}>
            {searchHistory.map((item, index) => (
              <li
                key={index}
                onClick={() => {
                  setIngredients(item);
                  setShowSuggestions(false);
                  fetchRecipes(item);
                }}
                style={{
                  padding: '8px',
                  cursor: 'pointer',
                  color: '#333'
                }}
              >
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button onClick={() => fetchRecipes()} style={{
          backgroundColor: '#ff7043',
          color: 'white',
          padding: '12px 20px',
          border: 'none',
          borderRadius: '10px',
          fontWeight: 'bold'
        }}>
          🔍 Get Recipes
        </button>
        <button onClick={() => setShowOnlyFavorites(!showOnlyFavorites)} style={{
          backgroundColor: '#fff',
          color: '#ff7043',
          padding: '12px 20px',
          border: '2px solid #ff7043',
          borderRadius: '10px',
          fontWeight: 'bold'
        }}>
          {showOnlyFavorites ? '🔁 Show All' : '⭐ Show Favorites Only'}
        </button>
      </div>

      <div style={{ backgroundColor: cardBg, padding: '15px', borderRadius: '10px', display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '20px' }}>
        <select value={cuisine} onChange={(e) => setCuisine(e.target.value)} style={{ padding: '10px', borderRadius: '8px' }}>
          <option value="">🍽️ All Cuisines</option>
          <option value="indian">Indian</option>
          <option value="italian">Italian</option>
          <option value="chinese">Chinese</option>
          <option value="mexican">Mexican</option>
        </select>

        <select value={diet} onChange={(e) => setDiet(e.target.value)} style={{ padding: '10px', borderRadius: '8px' }}>
          <option value="">🥗 All Diets</option>
          <option value="vegetarian">Vegetarian</option>
          <option value="vegan">Vegan</option>
          <option value="gluten free">Gluten Free</option>
        </select>

        <input
          type="number"
          placeholder="⏱️ Max Time (min)"
          value={maxTime}
          onChange={(e) => setMaxTime(e.target.value)}
          style={{ padding: '10px', borderRadius: '8px', width: '160px' }}
        />
      </div>

      {loading && <p>Loading recipes...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
        {visibleRecipes.map(recipe => (
          <RecipeCard
            key={`${recipe.id}-${recipe.title}`}
            recipe={recipe}
            isLiked={favoriteIds.includes(recipe.id)}
            onToggleLike={() => toggleFavorite(recipe)}
          />
        ))}
      </div>
    </div>
  );
}

export default Home;