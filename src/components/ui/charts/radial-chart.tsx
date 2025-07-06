import { RadialBar, RadialBarChart } from "recharts";

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/charts/chart";

export function CustomRadialChart({
  title,
  description,
  chartData,
  chartConfig,
}: {
  title: string;
  description: string;
  chartData: { key: string; value: number; fill: string }[];
  chartConfig: ChartConfig;
}) {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col items-center justify-center">
        <div className="text-lg font-bold text-black">{title}</div>
        <div className="text-sm text-gray-500">{description}</div>
      </div>
      <ChartContainer config={chartConfig} className="aspect-square h-[250px]">
        <RadialBarChart data={chartData} innerRadius={30} outerRadius={110}>
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                hideLabel
                nameKey="key"
                valueFormatter={(value) => `${value}g`}
              />
            }
          />
          <RadialBar dataKey="value" background />
        </RadialBarChart>
      </ChartContainer>
    </div>
  );
}
