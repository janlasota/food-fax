import { useMemo, useState } from "react";

import FoodCard from "../FoodCard";
import { Checkbox } from "../../components/ui/checkbox";
import { Combobox } from "../../components/ui/combobox";
import { dummyData } from "../../data/dummyData";
import { Category, type Food } from "../../types";

const categories = [
  // TODO: Support all option
  // { key: Category.All, label: "All" },
  { key: Category.Protein, label: "Protein" },
  { key: Category.Fruit, label: "Fruit" },
  { key: Category.Vegetable, label: "Vegetable" },
  { key: Category.Grain, label: "Grain" },
  { key: Category.Dairy, label: "Dairy" },
  { key: Category.Nuts, label: "Nuts" },
];

const Dashboard = () => {
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [selectedFoods, setSelectedFoods] = useState<Food[]>([]);

  const foodDetails = useMemo(() => {
    if (selectedCategories.length === 0) {
      return dummyData;
    }
    return dummyData.filter((food) => {
      return selectedCategories.includes(food.category);
    });
  }, [selectedCategories]);

  const handleSelectFood = (id: string) => {
    const food = dummyData.find((food) => food.id === id);
    if (food) {
      setSelectedFoods((prev) => {
        if (prev.includes(food)) {
          return prev.filter((f) => f.id !== food.id);
        }
        return [...prev, food];
      });
    }
  };

  const handleSelectCategory = (key: string) => {
    const category = categories.find((category) => category.key === key);
    if (category) {
      setSelectedCategories((prev) => {
        if (prev.includes(category.key)) {
          return prev.filter((key) => key !== category.key);
        }
        return [...prev, category.key];
      });
    }
  };

  return (
    <div className="flex flex-col p-4">
      {/* Header */}
      <div className="text-3xl font-bold mb-4">Food Fax</div>
      <div className="flex gap-4 mb-4 flex-1">
        {/* Left Panel */}
        <div className="w-1/2 bg-white border border-gray-300 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Instructions</h3>
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Categories</h4>
              <p className="text-sm text-blue-700">
                Filter the foods by selecting checkboxes or find a food using
                the combobox.
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-2">Comparison</h4>
              <p className="text-sm text-green-700">
                Select multiple foods to compare their nutritional values.
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-semibold text-purple-900 mb-2">Analysis</h4>
              <p className="text-sm text-purple-700">
                View charts and breakdowns in the bottom panel once you select a
                food.
              </p>
            </div>
          </div>
        </div>
        {/* Right Panel */}
        <div className="w-1/2 bg-white border border-gray-300 rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Food Details</h3>
            <Combobox
              options={dummyData.map((food) => ({
                value: food.id,
                label: food.name,
                image: food.image,
              }))}
              width={250}
              value={selectedFoods.map((food) => food.id)}
              onValueChange={(value) => {
                setSelectedFoods(
                  dummyData.filter((food) => value.includes(food.id))
                );
              }}
              checkboxClassName="cursor-pointer data-[state=checked]:bg-blue-600 border data-[state=checked]:border-blue-600 [&_[data-slot='checkbox-indicator']_svg]:!text-white"
              multiple
              placeholder="Select a food"
            />
          </div>
          <div className="flex">
            <div className="w-1/6">
              <div className="flex flex-col gap-2">
                {categories.map((category) => (
                  <div
                    className="flex items-center gap-2 cursor-pointer w-fit"
                    key={category.key}
                    onClick={() => handleSelectCategory(category.key)}
                    tabIndex={0}
                  >
                    <Checkbox
                      key={category.key}
                      className="cursor-pointer data-[state=checked]:bg-blue-600 border data-[state=checked]:border-blue-600"
                      checked={selectedCategories.includes(category.key)}
                    />
                    <span className="text-sm">{category.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="w-5/6 flex flex-col">
              <div className="max-h-64 overflow-y-auto">
                {foodDetails.length && selectedCategories.length > 0 ? (
                  <div className="space-y-2">
                    {foodDetails.map((food) => (
                      <FoodCard
                        key={food.id}
                        food={food}
                        isSelected={selectedFoods.includes(food)}
                        onSelect={handleSelectFood}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <div className="text-8xl mb-2">🍽️</div>
                    <p className="text-lg text-black">
                      Check some boxes to see foods and their details!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Bottom Panel */}
      <div className="h-1/2 bg-white border border-gray-300 rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Chart Breakdown</h3>
        {selectedFoods.length > 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <div className="text-6xl mb-4">📊</div>
              <p className="text-lg">
                Chart component will be implemented here
              </p>
              <p className="text-sm">
                Showing data for:{" "}
                {selectedFoods.map((food) => food.name).join(", ")}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <div className="text-6xl mb-4">📈</div>
              <p className="text-lg">
                Select a food to view its chart breakdown
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
