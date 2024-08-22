import { useEffect, useRef, useState } from "react";
import "./App.css";
import { getRecipes } from "./api/RecipeService";
import Header from "./components/Header";
import RecipeList from "./components/RecipeList";
import { Navigate, Route, Routes } from "react-router-dom";

function App() {
  const modalRef = useRef();
  const fileRef = useRef();
  const [data, setData] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const [values, setValues] = useState({
    name: "",
    category: "",
    recipe: "",
  });
  const [file, setFile] = useState(undefined);

  const getAllRecipes = async (page = 0, size = 10) => {
    try {
      setCurrentPage(page);
      const { data } = await getRecipes(page, size);
      setData(data);
      console.log(data);
    } catch (error) {
      console.log(error);
      fileRef.current.value = null;
    }
  };

  const toggleModal = (show) =>
    show ? modalRef.current.showModal() : modalRef.current.close();

  const onChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  useEffect(() => {
    getAllRecipes();
  }, []);

  return (
    <>
      <Header toggleModal={toggleModal} numberOfRecipes={data.totalElements} />
      <main className="main">
        <div className="container">
          <Routes>
            <Route path="/" element={<Navigate to={"/recipes"} />} />
            <Route
              path="/recipes"
              element={
                <RecipeList
                  data={data}
                  currentPage={currentPage}
                  getAllRecipes={getAllRecipes}
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
          <form>
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
                <input
                  type="text"
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
              <button
                onClick={() => toggleModal(false)}
                type="button"
                className="btn btn-danger"
              >
                Cancel
              </button>
              <button type="submit" className="btn">
                Save
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </>
  );
}

export default App;
