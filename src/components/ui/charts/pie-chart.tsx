import { Pie, PieChart } from "recharts";

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/charts/chart";

export function CustomPieChart({
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
      <ChartContainer
        config={item.chartConfig}
        className="aspect-square h-[250px]"
      >
        <PieChart>
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent hideLabel valueFormatter={valueFormatter} />
            }
          />
          <Pie data={item?.chartData} dataKey="value" nameKey="key" />
        </PieChart>
      </ChartContainer>
    </div>
  );
}
