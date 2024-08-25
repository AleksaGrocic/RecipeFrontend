import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { deleteRecipe, getRecipe } from "../api/RecipeService";
import ConfirmationModal from "./ConfirmationModal";

const RecipeDetails = ({
  updateRecipe,
  changeImage,
  getAllRecipes,
  recipeDeletedToast,
}) => {
  const [recipe, setRecipe] = useState({
    id: "",
    name: "",
    category: "",
    recipe: "",
    imageUrl: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const inputRef = useRef();
  const switchRef = useRef();
  const textareaRef = useRef();

  const { id } = useParams();
  const navigate = useNavigate();

  const fetchRecipe = async (id) => {
    try {
      const { data } = await getRecipe(id);
      setRecipe(data);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  const selectImage = () => {
    inputRef.current.click();
  };

  const updateImage = async (file) => {
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
      console.log(error);
    }
  };

  const handleEditMode = (event) => {
    setEditMode(event.target.checked);
    fetchRecipe(id);
  };

  const handleDeleteRecipe = async () => {
    setShowConfirmModal(true);
  };

  const confirmDeleteRecipe = async () => {
    setShowConfirmModal(false);
    await deleteRecipe(id);
    recipeDeletedToast();
    handleBackToList();
  };

  const cancelDeleteRecipe = () => {
    setShowConfirmModal(false);
  };

  const handleBackToList = () => {
    getAllRecipes(0, 1000);
    navigate("/recipes");
  };

  const adjustTextareaHeight = () => {
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  };

  const onChange = (event) => {
    setRecipe({
      ...recipe,
      [event.target.name]: event.target.value,
    });
    adjustTextareaHeight();
  };

  const onUpdateRecipe = async (event) => {
    event.preventDefault();
    await updateRecipe(recipe);
    await fetchRecipe(id);
  };

  useEffect(() => {
    fetchRecipe(id);
  }, []);

  useEffect(() => {
    adjustTextareaHeight();
  });

  return (
    <>
      <button onClick={handleBackToList} className="back_to_list">
        <i className="bi bi-arrow-left"></i> Back to list
      </button>
      <div className="switch_box">
        <span>Edit</span>
        <label className="switch">
          <input ref={switchRef} type="checkbox" onChange={handleEditMode} />
          <span className="slider round"></span>
        </label>
      </div>
      <form onSubmit={onUpdateRecipe}>
        <div className="profile">
          <div className="profile__details">
            <input type="hidden" defaultValue={recipe.id} name="id" required />
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
            <img src={recipe.imageUrl} alt={recipe.name} />
            <div
              style={{ display: editMode ? "block" : "none" }}
              className="profie__metadata"
            >
              <button onClick={selectImage} className="btn">
                <i className="bi bi-cloud-upload"> </i>Change image
              </button>
            </div>
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
        {editMode ? (
          <div className="form_footer">
            <button type="submit" className="btn">
              Save
            </button>
            <button
              onClick={handleDeleteRecipe}
              type="button"
              className="btn btn-danger"
            >
              Delete
            </button>
          </div>
        ) : (
          ""
        )}
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
        isOpen={showConfirmModal}
        onConfirm={confirmDeleteRecipe}
        onCancel={cancelDeleteRecipe}
      />
    </>
  );
};

export default RecipeDetails;
