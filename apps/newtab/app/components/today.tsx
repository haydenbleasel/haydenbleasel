import { Badge } from "@haydenbleasel/design-system/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@haydenbleasel/design-system/components/ui/card";
import { Skeleton } from "@haydenbleasel/design-system/components/ui/skeleton";
import { isSameDay } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { Suspense } from "react";

import { getTypefullyDrafts, getTypefullyPublishes } from "@/lib/typefully";
import type { Draft } from "@/lib/typefully";

const Post = ({ draft }: { draft: Draft }) => (
  <div
    key={draft.id}
    className="flex items-center justify-between gap-4 p-3 transition-colors hover:bg-muted"
  >
    <p className="line-clamp-1 w-full truncate text-wrap text-sm">
      {draft.preview ?? ""}
    </p>
    <Badge variant="outline" className="shrink-0">
      {draft.published_at ? "Published" : "Scheduled"}
    </Badge>
  </div>
);

const TodayContent = async () => {
  const [scheduled, published] = await Promise.all([
    getTypefullyDrafts(),
    getTypefullyPublishes(),
  ]);

  const timeZone = "America/Los_Angeles";
  const today = toZonedTime(new Date(), timeZone);

  const data = [...published, ...scheduled].filter((draft) => {
    if (draft.scheduled_date) {
      const scheduledDate = toZonedTime(
        new Date(draft.scheduled_date),
        timeZone
      );
      if (isSameDay(scheduledDate, today)) {
        return true;
      }
    }

    if (draft.published_at) {
      const publishedDate = toZonedTime(new Date(draft.published_at), timeZone);
      if (isSameDay(publishedDate, today)) {
        return true;
      }
    }

    return false;
  });

  if (!data.length) {
    return (
      <div className="flex size-full items-center justify-center p-3">
        <p className="text-muted-foreground text-sm">No posts today.</p>
      </div>
    );
  }

  return (
    <CardContent className="divide-y overflow-hidden rounded-xl border bg-card p-0 shadow-xs">
      {data
        .toSorted((a, b) => {
          const dateA = toZonedTime(
            new Date(a.published_at ?? a.scheduled_date ?? ""),
            timeZone
          );
          const dateB = toZonedTime(
            new Date(b.published_at ?? b.scheduled_date ?? ""),
            timeZone
          );

          return dateA.getTime() - dateB.getTime();
        })
        .map((draft) => (
          <Post key={draft.id} draft={draft} />
        ))}
    </CardContent>
  );
};

export const Today = () => (
  <Card className="min-h-[188px] gap-0 bg-sidebar p-1 shadow-xs">
    <CardHeader className="gap-0 px-3 py-2">
      <CardTitle className="font-normal text-muted-foreground text-sm">
        Today&apos;s Posts
      </CardTitle>
    </CardHeader>
    <Suspense fallback={<Skeleton className="h-[140px] rounded-xl" />}>
      <TodayContent />
    </Suspense>
  </Card>
);
