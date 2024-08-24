/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import Recipe from "./Recipe";

const RecipeList = ({ data, currentPage, getAllRecipes }) => {
  return (
    <main className="main">
      {data?.content?.length === 0 && <div>No Recipes</div>}

      <ul className="recipe__list">
        {data?.content?.length > 0 &&
          data.content.map((recipe) => (
            <Recipe recipe={recipe} key={recipe.id} />
          ))}
      </ul>

      {data?.content?.length > 0 && data?.totalPages > 1 && (
        <div className="pagination">
          <a
            onClick={() => getAllRecipes(currentPage - 1)}
            className={0 === currentPage ? "disabled" : ""}
          >
            &laquo;
          </a>

          {data &&
            [...Array(data.totalPages).keys()].map((page, index) => (
              <a
                onClick={() => getAllRecipes(page)}
                className={currentPage === page ? "active" : ""}
                key={page}
              >
                {page + 1}
              </a>
            ))}

          <a
            onClick={() => getAllRecipes(currentPage + 1)}
            className={data.totalPages === currentPage + 1 ? "disabled" : ""}
          >
            &raquo;
          </a>
        </div>
      )}
    </main>
  );
};

export default RecipeList;
