import { Badge } from "@haydenbleasel/design-system/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@haydenbleasel/design-system/components/ui/card";
import { Skeleton } from "@haydenbleasel/design-system/components/ui/skeleton";
import { cn } from "@haydenbleasel/design-system/lib/utils";
import { addDays, endOfWeek, format, startOfWeek } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { Suspense } from "react";

import { getTypefullyDrafts, getTypefullyPublishes } from "@/lib/typefully";

const getBadgeClasses = (count: number, goal: number) => {
  const classNames = {
    background: "bg-rose-50",
    text: "text-rose-700",
  };

  if (count >= goal) {
    classNames.text = "text-emerald-700";
    classNames.background = "bg-emerald-50";
  } else if (count > 0) {
    classNames.text = "text-amber-700";
    classNames.background = "bg-amber-50";
  }

  return classNames;
};

const DraftWeek = ({ title, posts }: { title: string; posts: number }) => {
  const { text, background } = getBadgeClasses(posts, 10);

  return (
    <div key={title} className="flex items-center justify-between p-3">
      <p className="text-sm">{title}</p>
      <p className="text-muted-foreground text-sm">
        <Badge
          variant="outline"
          className={cn(text, background, "border-none")}
        >
          {posts}
        </Badge>
      </p>
    </div>
  );
};

const DraftsContent = async () => {
  const [scheduled, published] = await Promise.all([
    getTypefullyDrafts(),
    getTypefullyPublishes(),
  ]);
  const data = [...scheduled, ...published];

  const { timeZone } = Intl.DateTimeFormat().resolvedOptions();
  const today = toZonedTime(new Date(), timeZone);
  const startOfThisWeek = startOfWeek(today, { weekStartsOn: 1 });
  const endOfThisWeek = endOfWeek(today, { weekStartsOn: 1 });

  const weeks = [
    {
      data: data.filter((draft) => {
        const date = toZonedTime(
          new Date(draft.scheduled_date ?? draft.published_at ?? ""),
          timeZone
        );
        return date >= startOfThisWeek && date <= endOfThisWeek;
      }),
      name: "This week",
    },
    {
      data: data.filter((draft) => {
        const date = toZonedTime(
          new Date(draft.scheduled_date ?? draft.published_at ?? ""),
          timeZone
        );
        return (
          date >= addDays(startOfThisWeek, 7) &&
          date <= addDays(endOfThisWeek, 7)
        );
      }),
      name: `Week of ${format(addDays(startOfThisWeek, 7), "MMM d")}`,
    },
    {
      data: data.filter((draft) => {
        const date = toZonedTime(
          new Date(draft.scheduled_date ?? draft.published_at ?? ""),
          timeZone
        );
        return (
          date >= addDays(startOfThisWeek, 14) &&
          date <= addDays(endOfThisWeek, 14)
        );
      }),
      name: `Week of ${format(addDays(startOfThisWeek, 14), "MMM d")}`,
    },
  ];

  return (
    <CardContent className="grid grid-cols-3 divide-x rounded-xl border bg-card p-0 shadow-xs">
      {weeks.map((week) => (
        <DraftWeek key={week.name} title={week.name} posts={week.data.length} />
      ))}
    </CardContent>
  );
};

export const Drafts = () => (
  <Card className="gap-0 bg-sidebar p-1 shadow-xs">
    <CardHeader className="gap-0 px-3 py-2">
      <CardTitle className="font-normal text-muted-foreground text-sm">
        Drafts
      </CardTitle>
    </CardHeader>
    <Suspense fallback={<Skeleton className="h-[46.5px] rounded-xl" />}>
      <DraftsContent />
    </Suspense>
  </Card>
);
