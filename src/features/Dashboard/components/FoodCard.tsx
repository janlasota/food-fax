import { TrashIcon } from "lucide-react";
import { cn } from "@/lib/utils";

import type { Food } from "../../../types";
import { Button } from "@/components/ui";

const FoodCard = ({
  food,
  isSelected,
  onSelect,
  onDelete,
}: {
  food: Food;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}) => {
  const renderImage =
    food.image?.includes("img.spoonacular.com") ||
    food.image?.includes("blob:");

  return (
    <div
      key={food.id}
      className={cn(
        "p-3 border border-gray-200 rounded-lg cursor-pointer",
        isSelected && "bg-blue-50",
        !isSelected && "hover:bg-gray-50"
      )}
      onClick={() => onSelect(food.id)}
      onKeyDown={(e) => {
        if (e.key === " " || e.key === "Enter") {
          onSelect(food.id);
        }
      }}
      tabIndex={0}
    >
      <div className="flex justify-between">
        <div className="flex items-center gap-2 mb-2">
          {renderImage ? (
            <img
              src={food.image}
              alt={food.name}
              className="w-6 h-6 rounded-full"
            />
          ) : (
            <div className="text-lg">{food.image ?? "✖️"}</div>
          )}
          <div className="font-medium">{food.name}</div>
        </div>
        {food.isCustomFood && (
          <Button
            variant="ghost"
            size="icon"
            className="cursor-pointer hover:bg-red-500 hover:text-white"
            onClick={(e) => {
              // Stop propagation so we don't trigger the onSelect
              e.stopPropagation();
              onDelete(food.id);
            }}
          >
            <TrashIcon className="w-4 h-4" />
          </Button>
        )}
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
