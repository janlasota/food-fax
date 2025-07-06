import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/charts/chart";

export function CustomBarChart({
  item,
  valueFormatter,
}: {
  item: {
    title: string;
    description: string;
    chartData: { key: string; value: number; fill: string }[];
    chartConfig: ChartConfig;
  };
  valueFormatter?: (value: number) => string;
}) {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col items-center justify-center">
        <div className="text-lg font-bold text-black">{item.title}</div>
        <div className="text-sm text-gray-500">{item.description}</div>
      </div>
      <ChartContainer className="h-[250px]" config={item.chartConfig}>
        <BarChart accessibilityLayer data={item.chartData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="key"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            hide
          />
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                indicator="dashed"
                valueFormatter={valueFormatter}
              />
            }
          />
          <Bar dataKey="value" radius={4} />
        </BarChart>
      </ChartContainer>
    </div>
  );
}
