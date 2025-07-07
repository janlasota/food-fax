import type { Category, Food, Ingredient } from "../../types";

const getSpoonacularImageUrl = (url: string): string => {
  return `https://img.spoonacular.com/ingredients_100x100/${url}`;
};

export const transformSpoonacularIngredient = (
  ingredient: Ingredient,
  key: string
): Food => {
  return {
    name: ingredient.name.charAt(0).toUpperCase() + ingredient.name.slice(1),
    id: ingredient.id.toString(),
    image: ingredient.image.includes("no.jpg")
      ? undefined
      : getSpoonacularImageUrl(ingredient.image),
    category: key as Category,
    // Generate random values between 0 and 100 since Spoonacular provides
    // these values in a separate api request which would be expensive for the
    // free tier and use case of this app.
    calories: Math.floor(Math.random() * 101),
    protein: Math.floor(Math.random() * 101),
    carbs: Math.floor(Math.random() * 101),
    fat: Math.floor(Math.random() * 101),
    servingSize: Math.floor(Math.random() * 101),
  };
};

export const getFoodDetailsText = (error: boolean, fetching: boolean) => {
  if (error) {
    return "There was an error fetching Spoonacular data. Please try again.";
  }
  if (fetching) {
    return "Fetching Spoonacular data...";
  }
  return "Check some boxes to see foods and their details!";
};
