import { Badge } from "@haydenbleasel/design-system/components/ui/badge";
import { Skeleton } from "@haydenbleasel/design-system/components/ui/skeleton";
import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { Suspense } from "react";

import { getUvForecast, getVitaminDMinutes, location } from "@/lib/weather";

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

export const Header = () => {
  const today = toZonedTime(new Date(), location.timeZone);

  return (
    <header className="flex justify-between gap-4">
      <div className="flex flex-col">
        <p className="font-medium text-sm">{format(today, "EEEE, MMMM d")}</p>
        <p className="text-muted-foreground text-sm">{location.name}</p>
      </div>
      <Suspense fallback={<Skeleton className="h-6 w-32 rounded-md" />}>
        <Uv />
      </Suspense>
    </header>
  );
};
