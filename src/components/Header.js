import React from "react";

const Header = ({ toggleModal, numberOfRecipes }) => {
  return (
    <header className="header">
      <div className="container">
        <h3>My recipes ({numberOfRecipes})</h3>
        <button onClick={() => toggleModal(true)} className="btn">
          <i className="bi bi-plus-square"></i>New recipe
        </button>
      </div>
    </header>
  );
};

export default Header;
