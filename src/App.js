/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from "react";
import "./App.css";
import { getRecipes, saveRecipe, updateImage } from "./api/RecipeService";
import Header from "./components/Header";
import RecipeList from "./components/RecipeList";
import RecipeDetails from "./components/RecipeDetails";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { toastError, toastSuccess } from "./api/ToastService";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const modalRef = useRef();
  const fileRef = useRef();
  const location = useLocation();
  const [data, setData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [values, setValues] = useState({
    name: "",
    category: "",
    recipe: "",
  });
  const [file, setFile] = useState(undefined);
  const [selectedTab, setSelectedTab] = useState("recipeList");

  const getAllRecipes = async (category = selectedCategory) => {
    try {
      const { data: recipes } = await getRecipes();

      const uniqueCategories = [
        "All",
        ...new Set(recipes.map((recipe) => recipe.category)),
      ];
      setCategories(uniqueCategories);

      const filteredRecipes =
        category === "All"
          ? recipes
          : recipes.filter((recipe) => recipe.category === category);

      setData(filteredRecipes);
      console.log(filteredRecipes);
    } catch (error) {
      console.log(error);
      toastError(error.message);
    }
  };

  const resetValues = () => {
    setValues({
      name: "",
      category: "",
      recipe: "",
    });
  };

  const updateRecipe = async (recipe) => {
    try {
      const { data } = await saveRecipe(recipe);
      console.log(data);
      toastSuccess("Recipe updated!");
    } catch (error) {
      console.log(error);
      toastError(error.message);
    }
  };

  const changeImage = async (formData) => {
    try {
      const { data: imageUrl } = await updateImage(formData);
      toastSuccess("Image updated!");
    } catch (error) {
      console.log(error);
      toastError(error.message);
    }
  };

  const onChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const toggleModal = (show) => {
    show ? modalRef.current.showModal() : modalRef.current.close();
    resetValues();
  };

  const handleNewRecipe = async (event) => {
    event.preventDefault();
    try {
      const { data } = await saveRecipe(values);
      const formData = new FormData();
      formData.append("file", file, file.name);
      formData.append("id", data.id);
      const { data: imageUrl } = await updateImage(formData);
      toggleModal(false);
      setFile(undefined);
      fileRef.current.value = null;
      resetValues();
      getAllRecipes();
      toastSuccess("Recipe created!");
    } catch (error) {
      console.log(error);
      toastError(error.message);
    }
  };

  const handleCategoryChange = async (event) => {
    const newCategory = event.target.value;
    setSelectedCategory(newCategory);
    await getAllRecipes(newCategory);
  };

  const recipeDeleted = async () => {
    try {
      toastSuccess("Recipe deleted!");
    } catch (error) {
      console.log(error);
      toastError(error.message);
    }
  };

  useEffect(() => {
    getAllRecipes();
  }, []);

  useEffect(() => {
    if (location.pathname === "/recipes") {
      setSelectedTab("recipeList");
    } else if (location.pathname.startsWith("/recipes/")) {
      setSelectedTab("recipeDetails");
    }
  }, [location]);

  return (
    <>
      <Header
        toggleModal={toggleModal}
        numberOfRecipes={data.length}
        selectedTab={selectedTab}
      />
      <main className="main">
        <div className="container">
          {selectedTab === "recipeList" && (
            <div className="category-filter">
              <label htmlFor="category-select">Filter by category: </label>
              <select
                id="category-select"
                value={selectedCategory}
                onChange={handleCategoryChange}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          )}

          <Routes>
            <Route path="/" element={<Navigate to={"/recipes"} />} />
            <Route
              path="/recipes"
              element={<RecipeList data={data} getAllRecipes={getAllRecipes} />}
            />
            <Route
              path="/recipes/:id"
              element={
                <RecipeDetails
                  updateRecipe={updateRecipe}
                  changeImage={changeImage}
                  getAllRecipes={getAllRecipes}
                  recipeDeleted={recipeDeleted}
                />
              }
            />
          </Routes>
        </div>
      </main>

      <dialog ref={modalRef} className="modal" id="modal">
        <div className="modal__header">
          <h3>New recipe</h3>
          <i onClick={() => toggleModal(false)} className="bi bi-x-lg"></i>
        </div>
        <div className="divider"></div>
        <div className="modal__body">
          <form onSubmit={handleNewRecipe}>
            <div className="user-details">
              <div className="input-box">
                <span className="details">Name</span>
                <input
                  type="text"
                  name="name"
                  value={values.name}
                  onChange={onChange}
                  required
                />
              </div>
              <div className="input-box">
                <span className="details">Category</span>
                <input
                  type="text"
                  name="category"
                  value={values.category}
                  onChange={onChange}
                  required
                />
              </div>
              <div className="input-box">
                <span className="details">Recipe</span>
                <textarea
                  className="input_textarea"
                  name="recipe"
                  value={values.recipe}
                  onChange={onChange}
                  required
                />
              </div>
              <div className="file-input">
                <span className="details">Image</span>
                <input
                  type="file"
                  name="image"
                  onChange={(event) => setFile(event.target.files[0])}
                  ref={fileRef}
                  required
                />
              </div>
            </div>
            <div className="form_footer">
              <button type="submit" className="btn">
                Save
              </button>
              <button
                onClick={() => toggleModal(false)}
                type="button"
                className="btn btn-danger"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </dialog>
      <ToastContainer />
    </>
  );
}

export default App;
