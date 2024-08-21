import axios from "axios";

const API_URL = "http://localhost:8080/recipes";

export async function saveRecipe(recipe) {
  return await axios.post(API_URL, recipe);
}

export async function getRecipes(page = 0, size = 10) {
  return await axios.get(`${API_URL}?page=${page}&size=${size}`);
}

export async function getRecipe(id) {
  return await axios.get(`${API_URL}/${id}`);
}

export async function updateRecipe(recipe) {
  return await axios.post(API_URL, recipe);
}

export async function updateImage(formData) {
  return await axios.put(`${API_URL}/image`, formData);
}

export async function deleteRecipe(id) {
  return await axios.delete(`${API_URL}/${id}`);
}
