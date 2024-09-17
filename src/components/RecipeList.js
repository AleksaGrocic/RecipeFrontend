import React from "react";
import Recipe from "./Recipe";

const RecipeList = ({ data }) => {
  return (
    <main className="main">
      {data?.length === 0 && <div>No recipes.</div>}

      <ul className="recipe__list">
        {data?.length > 0 &&
          data.map((recipe) => <Recipe recipe={recipe} key={recipe.id} />)}
      </ul>
    </main>
  );
};

export default RecipeList;
