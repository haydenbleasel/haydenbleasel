import type { Metadata } from "next";

import { PageHeader } from "@/components/page-header";
import { getPublishedPosts } from "@/lib/typefully";
import type { TypefullyPostWithAnalytics } from "@/lib/typefully";

export const metadata: Metadata = {
  description: "My recent posts on X, managed via Typefully.",
  title: "Posts | OS1",
};

const formatNumber = (num = 0) => {
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};

const getWeekStart = (date: string) => {
  const d = new Date(date);
  const day = d.getDay();
  d.setDate(d.getDate() - day);
  d.setHours(0, 0, 0, 0);
  return d;
};

const formatDate = (d: Date) =>
  d.toLocaleDateString("en-US", { day: "numeric", month: "short" });

const formatWeek = (date: string) => {
  const start = getWeekStart(date);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  return `${formatDate(start)} – ${formatDate(end)}, ${end.getFullYear()}`;
};

const groupByWeek = (posts: TypefullyPostWithAnalytics[]) => {
  const groups: { week: string; posts: TypefullyPostWithAnalytics[] }[] = [];

  for (const post of posts) {
    const week = post.published_at ? formatWeek(post.published_at) : "Unknown";
    const existing = groups.find((g) => g.week === week);
    if (existing) {
      existing.posts.push(post);
    } else {
      groups.push({ posts: [post], week });
    }
  }

  return groups;
};

const formatPostText = (text: string) => {
  const parts = text.replaceAll(/\n{2,}/g, " ").split(/(@\w+)/g);
  return parts.map((part) =>
    part.startsWith("@") ? (
      <span key={part} className="text-blue-500">
        {part}
      </span>
    ) : (
      part
    )
  );
};

const Post = ({ post }: { post: TypefullyPostWithAnalytics }) => (
  <a
    href={post.x_published_url ?? undefined}
    target="_blank"
    rel="noopener noreferrer"
    className="flex flex-col gap-2 rounded-lg px-3 py-2 no-underline transition-colors hover:bg-accent"
  >
    {post.preview && (
      <p className="whitespace-pre-wrap leading-relaxed text-sm">
        {formatPostText(post.preview)}
      </p>
    )}
    <div className="flex gap-4 text-xs text-muted-foreground">
      <span>{formatNumber(post.impressions)} impressions</span>
      <span>{formatNumber(post.likes)} likes</span>
      <span>{formatNumber(post.retweets)} retweets</span>
      <span>{formatNumber(post.replies)} replies</span>
    </div>
  </a>
);

const PostsPage = async () => {
  const posts = await getPublishedPosts();
  const grouped = groupByWeek(posts);

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Posts"
        description="My recent posts on X, managed via Typefully."
      />

      {grouped.map((group) => (
        <section
          key={group.week}
          className="flex flex-col gap-2 rounded-2xl bg-sidebar p-2"
        >
          <div className="px-4 pt-2 pb-1">
            <h2 className="text-sm font-medium text-muted-foreground">
              {group.week}
            </h2>
          </div>
          <div className="grid gap-2 rounded-2xl bg-background p-2 shadow-sm/5">
            {group.posts.map((post) => (
              <Post key={post.id} post={post} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export default PostsPage;
