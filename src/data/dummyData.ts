import { Category, type Food } from "../types";

// Dummy data pulled from https://www.nutritionix.com/
// Amount per serving. All numbers are in grams.
export const dummyData: Food[] = [
  {
    id: "1",
    name: "Chicken Breast",
    category: Category.Protein,
    image: "🍗",
    calories: 198,
    protein: 37,
    carbs: 0,
    fat: 4.3,
    servingSize: 120,
  },
  {
    id: "2",
    name: "Apple",
    category: Category.Fruit,
    image: "🍎",
    calories: 95,
    protein: 0.5,
    carbs: 25,
    fat: 0.3,
    servingSize: 182,
    diameter: 3,
  },
  {
    id: "3",
    name: "Broccoli",
    category: Category.Vegetable,
    image: "🥦",
    calories: 3.5,
    protein: 0.2,
    carbs: 0.7,
    fat: 0,
    servingSize: 10,
  },
];
