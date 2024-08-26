import React from "react";

const Header = ({ toggleModal, numberOfRecipes, selectedTab }) => {
  return (
    <header className="header">
      <div className="container">
        <h3 className="muted_text">
          {selectedTab === "recipeList"
            ? `My recipes (${numberOfRecipes})`
            : "Recipe"}
        </h3>
        <button onClick={() => toggleModal(true)} className="btn">
          <i className="bi bi-plus-square"></i>New recipe
        </button>
      </div>
    </header>
  );
};

export default Header;
