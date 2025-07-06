import { cn } from "@/lib/utils";

import type { Food } from "../../../types";

const FoodCard = ({
  food,
  isSelected,
  onSelect,
}: {
  food: Food;
  isSelected: boolean;
  onSelect: (id: string) => void;
}) => {
  return (
    <div
      key={food.id}
      className={cn(
        "p-3 border border-gray-200 rounded-lg cursor-pointer",
        isSelected && "bg-blue-50",
        !isSelected && "hover:bg-gray-50"
      )}
      onClick={() => onSelect(food.id)}
    >
      <div className="flex items-center gap-2 mb-2">
        <div className="text-lg">{food.image}</div>
        <div className="font-medium">{food.name}</div>
      </div>
      <div className="text-sm text-gray-600 flex flex-col gap-0.5">
        <div>
          {food.calories} {food.calories > 1 ? "calories" : "calorie"}
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
