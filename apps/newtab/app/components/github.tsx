import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@haydenbleasel/design-system/components/ui/card";
import { Skeleton } from "@haydenbleasel/design-system/components/ui/skeleton";
import { CircleDotIcon, GitPullRequestIcon } from "lucide-react";
import { Suspense } from "react";

import { getOpenIssuesAndPullRequests } from "@/lib/github";

const GitHubContent = async () => {
  const items = await getOpenIssuesAndPullRequests();

  if (!items.length) {
    return (
      <div className="flex size-full items-center justify-center p-3">
        <p className="text-muted-foreground text-sm">
          No open issues or pull requests.
        </p>
      </div>
    );
  }

  return (
    <CardContent className="divide-y overflow-y-auto rounded-xl border bg-card p-0 shadow-xs">
      {items.map((item) => (
        <a
          key={item.id}
          href={item.url}
          className="flex items-center gap-2 p-3"
        >
          {item.type === "pull-request" ? (
            <GitPullRequestIcon
              size={16}
              className="size-4 shrink-0 text-emerald-600"
            />
          ) : (
            <CircleDotIcon
              size={16}
              className="size-4 shrink-0 text-emerald-600"
            />
          )}
          <p className="truncate text-sm">{item.title}</p>
          <span className="ml-auto shrink-0 text-muted-foreground text-xs">
            {item.repo}#{item.number}
          </span>
          <span className="shrink-0 text-muted-foreground text-xs">
            {new Intl.DateTimeFormat("en-US", {
              dateStyle: "short",
            }).format(new Date(item.createdAt))}
          </span>
        </a>
      ))}
    </CardContent>
  );
};

export const GitHub = () => (
  <Card className="gap-0 bg-sidebar p-1 shadow-xs">
    <CardHeader className="gap-0 px-3 py-2">
      <CardTitle className="font-normal text-muted-foreground text-sm">
        GitHub
      </CardTitle>
    </CardHeader>
    <Suspense fallback={<Skeleton className="h-[46.5px] rounded-xl" />}>
      <GitHubContent />
    </Suspense>
  </Card>
);
