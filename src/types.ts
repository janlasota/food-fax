interface Food {
  id: string;
  name: string;
  category: string;
  image?: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingSize: number;
  diameter?: number;
  // TODO: Add fiber, sugar, and sodium
  // fiber: number;
  // sugar: number;
  // sodium: number;
}

export type { Food };
