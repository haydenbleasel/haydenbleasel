"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@haydenbleasel/design-system/components/ui/chart";
import type { ChartConfig } from "@haydenbleasel/design-system/components/ui/chart";
import { cn } from "@haydenbleasel/design-system/lib/utils";
import { format, parseISO } from "date-fns";
import { Line, LineChart, XAxis, YAxis } from "recharts";

const config = {
  followers: {
    color: "currentColor",
    label: "Followers",
  },
} satisfies ChartConfig;

export const FollowersChart = ({
  data,
  trend,
}: {
  data: { date: string; followers: number }[];
  trend: "up" | "down";
}) => (
  <ChartContainer
    className={cn(
      "aspect-auto h-5 w-16",
      trend === "up" ? "text-green-500" : "text-red-500"
    )}
    config={config}
  >
    <LineChart data={data} margin={{ bottom: 2, left: 0, right: 0, top: 2 }}>
      <XAxis dataKey="date" hide />
      <YAxis domain={["dataMin", "dataMax"]} hide />
      <ChartTooltip
        content={
          <ChartTooltipContent
            hideIndicator
            labelFormatter={(value) =>
              format(parseISO(value as string), "MMM d")
            }
          />
        }
        cursor={false}
      />
      <Line
        dataKey="followers"
        dot={false}
        stroke="currentColor"
        strokeWidth={1.5}
        type="monotone"
      />
    </LineChart>
  </ChartContainer>
);
