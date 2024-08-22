import React from "react";
import { Link } from "react-router-dom";

const Recipe = ({ recipe }) => {
  return (
    <Link to={`/recipes/${recipe.id}`} className="recipe__item">
      <div className="recipe__header">
        <div className="recipe__image">
          <img src={recipe.imageUrl} alt={recipe.name} />
        </div>
        <div className="recipe__details">
          <p className="recipe_name">{recipe.name.substring(0, 20)}</p>
          <p className="recipe_category">{recipe.category}</p>
        </div>
      </div>
    </Link>
  );
};

export default Recipe;
