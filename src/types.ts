enum Category {
  // TODO: Add all category
  // All = "all",
  Protein = "protein",
  Fruit = "fruit",
  Vegetable = "vegetable",
  Grain = "grain",
  Dairy = "dairy",
  Nuts = "nuts",
}

enum ChartType {
  Pie = "pie",
  Bar = "bar",
  Radial = "radial",
}

interface Food {
  id: string;
  name: string;
  category: Category;
  image?: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingSize: number;
  diameter?: number;
  isCustomFood?: boolean;
  // TODO: Add fiber, sugar, and sodium
  // fiber: number;
  // sugar: number;
  // sodium: number;
}
interface Ingredient {
  id: number;
  name: string;
  image: string;
}

export { Category, ChartType, type Food, type Ingredient };
