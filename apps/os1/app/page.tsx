import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@haydenbleasel/design-system/components/ui/card";
import {
  BookOpenIcon,
  CodeIcon,
  GamepadIcon,
  LayersIcon,
  MessageSquareIcon,
  MusicIcon,
} from "lucide-react";
import Link from "next/link";

import { PageHeader } from "@/components/page-header";

const pages = [
  {
    description: "What I've been playing on Steam.",
    href: "/games",
    icon: GamepadIcon,
    title: "Games",
  },
  {
    description: "My recent posts on X via Typefully.",
    href: "/posts",
    icon: MessageSquareIcon,
    title: "Posts",
  },
  {
    description: "Open source work on GitHub and npm.",
    href: "/code",
    icon: CodeIcon,
    title: "Code",
  },
  {
    description: "What I've been listening to on Spotify.",
    href: "/music",
    icon: MusicIcon,
    title: "Music",
  },
  {
    description: "The tools and services I use daily.",
    href: "/stack",
    icon: LayersIcon,
    title: "Stack",
  },
  {
    description: "What I've been reading on Oku.",
    href: "/books",
    icon: BookOpenIcon,
    title: "Books",
  },
];

const HomePage = () => (
  <div className="flex flex-col gap-8">
    <PageHeader
      title="OS1"
      description="An operating system for my public-facing life."
    />

    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {pages.map((page) => (
        <Link key={page.href} href={page.href}>
          <Card size="sm" className="h-full transition-colors hover:bg-accent">
            <CardHeader>
              <page.icon className="size-5 text-muted-foreground" />
              <CardTitle>{page.title}</CardTitle>
              <CardDescription>{page.description}</CardDescription>
            </CardHeader>
          </Card>
        </Link>
      ))}
    </div>
  </div>
);

export default HomePage;
