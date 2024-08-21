import React from "react";

const Header = ({ toggleModal, numberOfRecipes }) => {
  return (
    <header className="header">
      <div className="container">
        <h3>Recipe list ({numberOfRecipes})</h3>
        <button onClick={() => toggleModal(true)} className="btn">
          <i className="bi bi-plus-square"></i>Add New Recipe
        </button>
      </div>
    </header>
  );
};

export default Header;
