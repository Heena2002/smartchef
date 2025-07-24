import React from 'react';
import axios from '../api/axios'; // ✅ Use custom axios instance with token

function RecipeCard({ recipe, isLiked, onToggleLike }) {
  const handleLike = async () => {
    onToggleLike();

    if (!isLiked) {
      try {
        await axios.post('/api/favorites/add', {
          recipeId: recipe.id,
          title: recipe.title,
          image: recipe.image,
          sourceUrl: recipe.sourceUrl || `https://spoonacular.com/recipes/${recipe.title.replaceAll(' ', '-').toLowerCase()}-${recipe.id}`
        });
      } catch (error) {
        console.error("❌ Failed to save favorite:", error.response?.data || error.message);
      }
    } else {
      try {
        await axios.delete(`/api/favorites/${recipe.id}`);
      } catch (error) {
        console.error("❌ Failed to remove favorite:", error.response?.data || error.message);
      }
    }
  };

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
        padding: '15px',
        width: '220px',
        position: 'relative',
        transition: 'transform 0.3s ease',
        textAlign: 'center',
        cursor: 'pointer'
      }}
    >
      <img
        src={recipe.image}
        alt={recipe.title}
        style={{
          width: '100%',
          height: '150px',
          objectFit: 'cover',
          borderRadius: '10px',
          marginBottom: '10px'
        }}
      />

      {/* ❤️ Like Button */}
      <button
        onClick={handleLike}
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          background: 'none',
          border: 'none',
          fontSize: '20px',
          cursor: 'pointer',
          color: isLiked ? 'red' : 'gray'
        }}
      >
        {isLiked ? '❤️' : '🤍'}
      </button>

      <h4 style={{ fontSize: '16px', margin: '10px 0', color: '#2E3A59' }}>
        {recipe.title}
      </h4>

      <a
        href={`https://spoonacular.com/recipes/${recipe.title.replaceAll(' ', '-').toLowerCase()}-${recipe.id}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          textDecoration: 'none',
          color: '#ff7043',
          fontWeight: 'bold'
        }}
      >
        View Recipe 🔗
      </a>
    </div>
  );
}

export default RecipeCard;