import { useEffect, useState } from "react";
import "./App.css";
import { getRecipes } from "./api/RecipeService";

function App() {
  const [data, setData] = useState({});
  const [currentPage, setCurrentPage] = useState(0);

  const getAllRecipes = async (page = 0, size = 10) => {
    try {
      setCurrentPage(page);
      const { data } = await getRecipes(page, size);
      setData(data);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllRecipes();
  }, []);

  return (
    <div>
      <h1>Hello</h1>
    </div>
  );
}

export default App;
