import React from "react";
import Recipe from "./Recipe";

const RecipeList = ({ data }) => {
  return (
    <main className="main">
      {data?.content?.length === 0 && <div>No Recipes</div>}

      <ul className="recipe__list">
        {data?.content?.length > 0 &&
          data.content.map((recipe) => (
            <Recipe recipe={recipe} key={recipe.id} />
          ))}
      </ul>
    </main>
  );
};

export default RecipeList;
