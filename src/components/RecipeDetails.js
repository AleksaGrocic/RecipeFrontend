import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { deleteRecipe, getRecipe } from "../api/RecipeService";
import ConfirmationModal from "./ConfirmationModal";

const RecipeDetails = ({
  updateRecipe,
  changeImage,
  getAllRecipes,
  recipeDeleted,
}) => {
  const [recipe, setRecipe] = useState({
    id: "",
    name: "",
    category: "",
    recipe: "",
    imageUrl: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [showConfirmationModal, setshowConfirmationModal] = useState(false);

  const inputRef = useRef();
  const textareaRef = useRef();

  const { id } = useParams();
  const navigate = useNavigate();

  const fetchRecipe = async (id) => {
    try {
      const { data } = await getRecipe(id);
      if (data) {
        setRecipe(data);
      } else {
        console.error("No recipe found.");
      }
    } catch (error) {
      console.error("Error fetching recipe:", error);
    }
  };

  const selectImage = () => {
    inputRef.current.click();
  };

  const updateImage = async (file) => {
    if (!file) return;
    try {
      const formData = new FormData();
      formData.append("file", file, file.name);
      formData.append("id", id);
      await changeImage(formData);
      setRecipe((prev) => ({
        ...prev,
        imageUrl: `${prev.imageUrl}?updated_at=${new Date().getTime()}`,
      }));
    } catch (error) {
      console.error("Error updating image:", error);
    }
  };

  const toggleEditMode = () => {
    setEditMode((prevMode) => !prevMode);
    if (editMode) {
      fetchRecipe(id);
    }
  };

  const handleDeleteRecipe = () => {
    setshowConfirmationModal(true);
  };

  const confirmDeleteRecipe = async () => {
    setshowConfirmationModal(false);
    try {
      await deleteRecipe(id);
      await getAllRecipes();
      await recipeDeleted();
      handleBackToList();
    } catch (error) {
      console.error("Error deleting recipe:", error);
    }
  };

  const cancelDeleteRecipe = () => {
    setshowConfirmationModal(false);
  };

  const handleBackToList = () => {
    navigate("/recipes");
    getAllRecipes();
  };

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      const scrollPos = window.scrollY;
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      window.scrollTo(0, scrollPos);
    }
  };

  const onChange = (event) => {
    setRecipe((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
    adjustTextareaHeight();
  };

  const onUpdateRecipe = async (event) => {
    event.preventDefault();
    try {
      await updateRecipe(recipe);
      toggleEditMode();
    } catch (error) {
      console.error("Error updating recipe:", error);
    }
  };

  useEffect(() => {
    fetchRecipe(id);
  }, [id]);

  useEffect(() => {
    adjustTextareaHeight();
  }, [recipe.recipe]);

  return (
    <>
      <button onClick={handleBackToList} className="back_to_list">
        <i className="bi bi-arrow-left"></i> Back to list
      </button>
      <div className="switch_box">
        <span>Edit</span>
        <label className="switch">
          <input type="checkbox" onChange={toggleEditMode} checked={editMode} />
          <span className="slider round"></span>
        </label>
      </div>
      <form onSubmit={onUpdateRecipe}>
        <div className="profile">
          <div className="profile__details">
            <input type="hidden" value={recipe.id} name="id" required />
            {!editMode ? (
              <h3 className="recipe__name muted_text">{recipe.name}</h3>
            ) : (
              <div
                className="input-box"
                style={{ display: "flex", width: "100%" }}
              >
                <input
                  type="text"
                  onChange={onChange}
                  value={recipe.name}
                  name="name"
                  placeholder="Recipe name"
                  required
                />
              </div>
            )}

            {!editMode ? (
              <p className="recipe_category">{recipe.category}</p>
            ) : (
              <div
                className="input-box"
                style={{ display: "flex", width: "100%" }}
              >
                <input
                  type="text"
                  onChange={onChange}
                  value={recipe.category}
                  name="category"
                  placeholder="Category"
                  required
                />
              </div>
            )}
            {recipe.imageUrl && <img src={recipe.imageUrl} alt={recipe.name} />}
            {editMode && (
              <div className="profile__metadata">
                <button type="button" onClick={selectImage} className="btn">
                  <i className="bi bi-cloud-upload"></i> Change image
                </button>
                <div className="save-delete-buttons">
                  <button type="submit" className="btn">
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteRecipe}
                    className="btn btn-danger"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="profile__settings">
            <div>
              <textarea
                readOnly={!editMode}
                value={recipe.recipe}
                className={!editMode ? "textarea_off" : ""}
                ref={textareaRef}
                onChange={onChange}
                spellCheck="false"
                name="recipe"
                placeholder="Recipe text..."
                required
              ></textarea>
            </div>
          </div>
        </div>
      </form>

      <form style={{ display: "none" }}>
        <input
          type="file"
          ref={inputRef}
          onChange={(event) => updateImage(event.target.files[0])}
          name="file"
          accept="image/*"
        />
      </form>

      <ConfirmationModal
        isOpen={showConfirmationModal}
        onConfirm={confirmDeleteRecipe}
        onCancel={cancelDeleteRecipe}
      />
    </>
  );
};

export default RecipeDetails;
