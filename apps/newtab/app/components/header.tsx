import { Badge } from "@haydenbleasel/design-system/components/ui/badge";
import { Skeleton } from "@haydenbleasel/design-system/components/ui/skeleton";
import { cn } from "@haydenbleasel/design-system/lib/utils";
import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { ArrowDown, ArrowUp } from "lucide-react";
import { Suspense } from "react";

import { getTypefullyFollowers } from "@/lib/typefully";
import { getUvForecast, getVitaminDMinutes, location } from "@/lib/weather";

import { FollowersChart } from "./followers-chart";

const formatTime = (minutes: number) => {
  const hour24 = Math.floor(minutes / 60);
  const minute = Math.round(minutes % 60);
  const period = hour24 >= 12 ? "pm" : "am";
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;

  return minute === 0
    ? `${hour12}${period}`
    : `${hour12}:${minute.toString().padStart(2, "0")}${period}`;
};

const Uv = async () => {
  const forecast = await getUvForecast();

  if (!forecast) {
    return null;
  }

  const vitaminDMinutes = getVitaminDMinutes(forecast.peak);

  return (
    <div className="flex gap-2">
      <Badge variant="outline" className="shrink-0">
        UV{forecast.peak}
        {vitaminDMinutes ? ` (${vitaminDMinutes}m)` : null}
      </Badge>
      {forecast.range ? (
        <span className="text-muted-foreground text-sm">
          {formatTime(forecast.range.start)} &rarr;{" "}
          {formatTime(forecast.range.end)}
        </span>
      ) : null}
    </div>
  );
};

const Followers = async () => {
  const followers = await getTypefullyFollowers();

  if (!followers) {
    return null;
  }

  const first = followers.data.at(0)?.followers ?? 0;
  const last = followers.data.at(-1)?.followers ?? 0;
  const change = first === 0 ? 0 : ((last - first) / first) * 100;
  const trend = change >= 0 ? "up" : "down";
  const percent = Number(Math.abs(change).toFixed(1));
  const TrendIcon = trend === "up" ? ArrowUp : ArrowDown;

  return (
    <div className="flex items-center gap-2">
      <span className="flex items-center gap-1 text-muted-foreground text-sm">
        Followers
        <span
          className={cn(
            "flex items-center gap-0.5",
            trend === "up" ? "text-green-500" : "text-red-500"
          )}
        >
          <TrendIcon className="size-3.5" />
          {percent}%
        </span>
        this month
      </span>
      <FollowersChart data={followers.data} trend={trend} />
    </div>
  );
};

export const Header = () => {
  const today = toZonedTime(new Date(), location.timeZone);

  return (
    <header className="flex justify-between gap-4">
      <div className="flex flex-col">
        <p className="font-medium text-sm">{format(today, "EEEE, MMMM d")}</p>
        <p className="text-muted-foreground text-sm">{location.name}</p>
      </div>
      <div className="flex flex-col items-end gap-2">
        <Suspense fallback={<Skeleton className="h-6 w-32 rounded-md" />}>
          <Uv />
        </Suspense>
        <Suspense fallback={<Skeleton className="h-5 w-64 rounded-md" />}>
          <Followers />
        </Suspense>
      </div>
    </header>
  );
};
