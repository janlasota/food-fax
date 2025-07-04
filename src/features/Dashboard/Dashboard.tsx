import { useState } from "react";
import type { Food } from "../../types";
import { dummyData } from "../../data/dummyData";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

const Dashboard = () => {
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);

  const handleSelectFood = (id: string) => {
    setSelectedFood(dummyData.find((food) => food.id === id) || null);
  };

  return (
    <div className="p-4">
      <div className="text-2xl font-bold">Food Fax</div>
      <div>
        Selected Food: {selectedFood?.image} {selectedFood?.name}
      </div>
      <Select onValueChange={(id) => handleSelectFood(id)}>
        <SelectTrigger className="cursor-pointer">
          <SelectValue placeholder="Select a food" />
        </SelectTrigger>
        <SelectContent>
          {dummyData.map((food) => (
            <SelectItem
              className="cursor-pointer"
              key={food.id}
              value={food.id}
            >
              {food.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default Dashboard;
