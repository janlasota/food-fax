import type { Ingredient } from "../types";

const API_KEY = import.meta.env.VITE_SPOONACULAR_API_KEY;
const BASE_URL = "https://api.spoonacular.com/food";

export const searchIngredients = async (
  query: string,
  number: number = 1
): Promise<Ingredient[] | string> => {
  try {
    const response = await fetch(
      `${BASE_URL}/ingredients/search?apiKey=${API_KEY}&query=${query}&number=${number}&addChildren=true`
    );

    if (!response.ok) {
      return `Error fetching ingredients: ${response.status}`;
    }

    const data = await response.json();
    return data.results || [];
  } catch (error) {
    return `Error fetching ingredients: ${error}`;
  }
};
