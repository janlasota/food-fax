import { useMemo, useState } from "react";
import { TestTubeDiagonalIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { searchIngredients } from "../../services/spoonacular";

import {
  Button,
  CustomBarChart,
  CustomPieChart,
  CustomRadialChart,
  Checkbox,
  Combobox,
  Spinner,
  Tabs,
  TabsList,
  TabsTrigger,
} from "../../components/ui";
import { dummyData } from "../../data/dummyData";
import { Category, ChartType, type Food } from "../../types";
import { FoodCard, Legend, SpoonacularDialog } from "./components";
import { transformSpoonacularIngredient } from "./Dashboard.utils";

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

const chartConfig = {
  protein: {
    label: "Protein",
  },
  carbs: {
    label: "Carbs",
  },
  fat: {
    label: "Fat",
  },
};

const Dashboard = () => {
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [selectedFoods, setSelectedFoods] = useState<Food[]>([]);
  const [chartType, setChartType] = useState<ChartType>(ChartType.Pie);
  const [useSpoonacular, setUseSpoonacular] = useState<boolean>(false);
  const [spoonacularModalOpen, setSpoonacularModalOpen] =
    useState<boolean>(false);
  const [spoonacularData, setSpoonacularData] = useState<Food[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const data = useMemo(() => {
    return useSpoonacular ? spoonacularData : dummyData;
  }, [spoonacularData, useSpoonacular]);

  const foodDetails = useMemo(() => {
    if (selectedCategories.length === 0) {
      return data;
    }
    return data.filter((food) => {
      return selectedCategories.includes(food.category);
    });
  }, [data, selectedCategories]);

  const radialChartData = useMemo(() => {
    // Calculate total nutritional facts from all selected foods
    const totalProtein = selectedFoods.reduce(
      (sum, food) => sum + food.protein,
      0
    );
    const totalCarbs = selectedFoods.reduce((sum, food) => sum + food.carbs, 0);
    const totalFat = selectedFoods.reduce((sum, food) => sum + food.fat, 0);

    return [
      { key: "protein", value: totalProtein, fill: "var(--chart-1)" },
      { key: "carbs", value: totalCarbs, fill: "var(--chart-2)" },
      { key: "fat", value: totalFat, fill: "var(--chart-3)" },
    ];
  }, [selectedFoods]);

  const handleSelectFood = (id: string) => {
    const food = data.find((food) => food.id === id);
    if (food) {
      setSelectedFoods((prev) => {
        if (prev.includes(food)) {
          return prev.filter((f) => f.id !== food.id);
        }
        return [...prev, food];
      });
    }
  };

  const handleSelectCategory = async (key: string) => {
    if (useSpoonacular) {
      // Skip doing request if the category is already in the data
      if (!spoonacularData.some((food) => food.category === key)) {
        setIsFetching(true);
        const ingredient = await searchIngredients(key, 2);
        const foods = ingredient.map((ingredient) =>
          transformSpoonacularIngredient(ingredient, key)
        );
        setSpoonacularData((prev) => [...prev, ...foods]);
        setIsFetching(false);
      }
    }
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

  const handleToggleSpoonacular = () => {
    if (!useSpoonacular) {
      setUseSpoonacular(true);
      setSelectedFoods([]);
      setSelectedCategories([]);
    } else {
      setSpoonacularModalOpen(true);
    }
  };

  const handleDisableSpoonacular = () => {
    setUseSpoonacular(false);
    setSpoonacularModalOpen(false);
    setSelectedFoods([]);
    setSelectedCategories([]);
  };

  return (
    <>
      <div className="flex flex-col p-4">
        <div className="flex justify-between items-center mb-4">
          {/* Header */}
          <div className="flex items-center gap-2 text-3xl">
            <div>🍜</div>
            <h1 className="font-bold">Food Fax</h1>
          </div>
          <Button
            variant="default"
            className={cn("flex items-center gap-2 cursor-pointer text-white", {
              "bg-green-500 hover:bg-green-600": !useSpoonacular,
              "bg-red-500 hover:bg-red-600": useSpoonacular,
            })}
            onClick={handleToggleSpoonacular}
          >
            <TestTubeDiagonalIcon className="w-4 h-4" />
            <div className="text-sm">
              {useSpoonacular
                ? "Disable Spoonacular API"
                : "Enable Spoonacular API"}
            </div>
          </Button>
        </div>
        <div className="flex gap-4 mb-4">
          {/* Left Panel */}
          <div className="w-1/2 bg-white border border-gray-300 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Instructions</h2>
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">Categories</h3>
                <p className="text-sm text-blue-700">
                  Filter the foods by selecting checkboxes or find a food using
                  the combobox.
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-900 mb-2">
                  Comparison
                </h3>
                <p className="text-sm text-green-700">
                  Select multiple foods to compare their nutritional values.
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-900 mb-2">Analysis</h3>
                <p className="text-sm text-purple-700">
                  View breakdowns in the bottom panel once you select a food.
                </p>
              </div>
            </div>
          </div>
          {/* Right Panel */}
          <div className="w-1/2 bg-white border border-gray-300 rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Food Details</h2>
              <Combobox
                options={data.map((food) => ({
                  value: food.id,
                  label: food.name,
                  image: food.image,
                }))}
                width={250}
                value={selectedFoods.map((food) => food.id)}
                onValueChange={(value) => {
                  setSelectedFoods(
                    data.filter((food) => value.includes(food.id))
                  );
                }}
                checkboxClassName="cursor-pointer data-[state=checked]:bg-blue-600 border data-[state=checked]:border-blue-600 [&_[data-slot='checkbox-indicator']_svg]:!text-white"
                multiple
                multipleItemsDisplayText="foods"
                placeholder="Search all food data"
                useImageUrl={useSpoonacular}
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
                      <span className="text-sm text-black">
                        {category.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="w-5/6 flex flex-col">
                <div className="max-h-64 overflow-y-auto">
                  {!isFetching &&
                  foodDetails.length &&
                  selectedCategories.length > 0 ? (
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
                    <div className="flex flex-col items-center justify-center h-[225px]">
                      {isFetching ? (
                        <Spinner className="mb-2" />
                      ) : (
                        <div className="text-8xl mb-2">🍽️</div>
                      )}
                      <p className="text-lg text-black">
                        {isFetching
                          ? "Fetching Spoonacular data..."
                          : "Check some boxes to see foods and their details!"}
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
          <div
            className={cn("flex justify-between items-center", {
              "mb-4": chartType !== ChartType.Radial,
            })}
          >
            <h2 className="text-xl font-semibold">Chart Breakdown</h2>
            {selectedFoods.length > 0 && (
              <Tabs defaultValue={ChartType.Pie} value={chartType}>
                <TabsList className="w-[200px]">
                  <TabsTrigger
                    value={ChartType.Pie}
                    className="cursor-pointer"
                    onClick={() => setChartType(ChartType.Pie)}
                  >
                    Pie
                  </TabsTrigger>
                  <TabsTrigger
                    value={ChartType.Bar}
                    className="cursor-pointer"
                    onClick={() => setChartType(ChartType.Bar)}
                  >
                    Bar
                  </TabsTrigger>
                  <TabsTrigger
                    value={ChartType.Radial}
                    className="cursor-pointer"
                    onClick={() => setChartType(ChartType.Radial)}
                  >
                    Radial
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            )}
          </div>
          {selectedFoods.length > 0 ? (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-center gap-4 overflow-x-auto">
                {selectedFoods.map((food) => {
                  const chartData = [
                    {
                      key: "protein",
                      value: food.protein,
                      fill: "var(--chart-1)",
                    },
                    {
                      key: "carbs",
                      value: food.carbs,
                      fill: "var(--chart-2)",
                    },
                    { key: "fat", value: food.fat, fill: "var(--chart-3)" },
                  ];

                  return (
                    <div key={food.id}>
                      {chartType === ChartType.Pie && (
                        <CustomPieChart
                          key={food.id}
                          item={{
                            title: food.name,
                            description: `${food.calories} kcal`,
                            chartData,
                            chartConfig,
                          }}
                          valueFormatter={(value) => `${value}g`}
                        />
                      )}
                      {chartType === ChartType.Bar && (
                        <CustomBarChart
                          key={food.id}
                          item={{
                            title: food.name,
                            description: `${food.calories} kcal`,
                            chartData,
                            chartConfig,
                          }}
                          valueFormatter={(value) => `${value}g`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
              {chartType === ChartType.Radial && (
                <div className="flex items-center justify-center">
                  <CustomRadialChart
                    title="Combined Nutritional Facts"
                    description="Select foods to curate your own meal!"
                    chartData={radialChartData}
                    chartConfig={chartConfig}
                  />
                </div>
              )}
              <div className="flex justify-center">
                <Legend
                  items={[
                    { label: "Protein", color: "var(--chart-1)" },
                    { label: "Carbs", color: "var(--chart-2)" },
                    { label: "Fat", color: "var(--chart-3)" },
                  ]}
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <div className="text-8xl mb-4">📈</div>
              <p className="text-lg text-black">
                Select a food to view its chart breakdown!
              </p>
            </div>
          )}
        </div>
      </div>
      <SpoonacularDialog
        open={spoonacularModalOpen}
        handleCancel={() => setSpoonacularModalOpen(false)}
        handleYes={handleDisableSpoonacular}
      />
    </>
  );
};

export default Dashboard;
