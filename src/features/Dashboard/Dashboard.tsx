import { useMemo, useState } from "react";
import { PlusIcon, TestTubeDiagonalIcon } from "lucide-react";

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
import {
  AddFoodDialog,
  FoodCard,
  Instructions,
  Legend,
  SpoonacularDialog,
} from "./components";
import {
  getFoodDetailsText,
  transformSpoonacularIngredient,
} from "./Dashboard.utils";

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
  const [spoonacularData, setSpoonacularData] = useState<Food[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [spoonacularModalOpen, setSpoonacularModalOpen] =
    useState<boolean>(false);
  const [addFoodDialogOpen, setAddFoodDialogOpen] = useState<boolean>(false);
  const [customFoods, setCustomFoods] = useState<Food[]>([]);

  const data = useMemo(() => {
    return useSpoonacular
      ? [...spoonacularData, ...customFoods]
      : [...dummyData, ...customFoods];
  }, [customFoods, spoonacularData, useSpoonacular]);

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
      // Clear any previous errors if the user selects a category again
      if (error) setError(false);
      // Skip doing request if the category is already in the data
      if (!spoonacularData.some((food) => food.category === key)) {
        setIsFetching(true);
        const ingredient = await searchIngredients(key, 2);
        if (typeof ingredient === "string") {
          setError(true);
          setIsFetching(false);
          return;
        } else {
          const foods = ingredient.map((ingredient) =>
            transformSpoonacularIngredient(ingredient, key)
          );
          setSpoonacularData((prev) => [...prev, ...foods]);
          setIsFetching(false);
        }
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

  const handleDeleteFood = (id: string) => {
    setCustomFoods((prev) => prev.filter((food) => food.id !== id));
  };

  return (
    <>
      <div className="flex flex-col p-4 h-full">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
          {/* Header */}
          <div className="flex items-center gap-2 text-3xl">
            <div>🍜</div>
            <h1 className="font-bold">Food Fax</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="default"
              className="flex items-center gap-2 cursor-pointer text-white"
              onClick={() => setAddFoodDialogOpen(true)}
            >
              <PlusIcon className="w-4 h-4" />
              Add food
            </Button>
            <Button
              variant="default"
              className={cn(
                "flex items-center gap-2 cursor-pointer text-white",
                {
                  "bg-green-500 hover:bg-green-600": !useSpoonacular,
                  "bg-red-500 hover:bg-red-600": useSpoonacular,
                }
              )}
              onClick={handleToggleSpoonacular}
            >
              <TestTubeDiagonalIcon className="w-4 h-4" />
              {useSpoonacular
                ? "Disable Spoonacular API"
                : "Enable Spoonacular API"}
            </Button>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row gap-4 mb-4">
          {/* Left Panel */}
          <Instructions />
          {/* Right Panel */}
          <div className="w-full lg:w-1/2 bg-white border border-gray-300 rounded-lg p-6">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
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
                noOptionsFoundText="No food found."
                useImageUrl={useSpoonacular}
              />
            </div>
            <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
              <div className="w-full lg:w-1/6">
                <div className="flex flex-row lg:flex-col gap-3 lg:gap-2 flex-wrap">
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
              <div className="w-full flex flex-col">
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
                          onDelete={handleDeleteFood}
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
                        {getFoodDetailsText(error, isFetching)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Bottom Panel */}
        <div className="h-full bg-white border border-gray-300 rounded-lg p-6">
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
            <div className="flex flex-col items-center justify-center h-[325px]">
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
      <AddFoodDialog
        open={addFoodDialogOpen}
        handleClose={() => setAddFoodDialogOpen(false)}
        handleAdd={(food) => setCustomFoods((prev) => [...prev, food])}
      />
    </>
  );
};

export default Dashboard;
