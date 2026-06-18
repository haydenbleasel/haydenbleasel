import { Badge } from "@haydenbleasel/design-system/components/ui/badge";
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight, Clock, Download, GitFork, Star } from "lucide-react";

import { formatCompactNumber, formatRelativeDate } from "@/lib/format";
import type { OpenSourceRepository } from "@/lib/github";
import type { NpmDownloadTrend } from "@/lib/npm";

const languageColors: Record<string, string> = {
  CSS: "bg-sky-500",
  Go: "bg-cyan-500",
  JavaScript: "bg-yellow-400",
  MDX: "bg-pink-500",
  Python: "bg-blue-500",
  Rust: "bg-orange-500",
  Shell: "bg-emerald-500",
  TypeScript: "bg-blue-600",
};

const getSparklinePath = (points: number[]) => {
  if (points.length < 2) {
    return "";
  }

  const width = 84;
  const height = 24;
  const padding = 2;
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;

  return points
    .map((point, index) => {
      const x = padding + (index / (points.length - 1)) * (width - padding * 2);
      const y =
        height - padding - ((point - min) / range) * (height - padding * 2);
      const command = index === 0 ? "M" : "L";

      return `${command}${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
};

const DownloadSparkline = ({
  downloads,
}: {
  downloads: NpmDownloadTrend | null;
}) => {
  if (!downloads || downloads.points.length < 2) {
    return (
      <span aria-hidden="true" className="hidden h-6 w-[5.25rem] lg:block" />
    );
  }

  const path = getSparklinePath(downloads.points);

  return (
    <span className="hidden h-6 w-[5.25rem] shrink-0 items-center lg:flex">
      <svg
        aria-hidden="true"
        className="h-5 w-[4.5rem] text-foreground/45 transition-colors group-hover/project:text-foreground"
        fill="none"
        viewBox="0 0 84 24"
      >
        <path
          d={path}
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="2"
        />
      </svg>
    </span>
  );
};

const Metric = ({
  icon: Icon,
  value,
  width = "lg:w-[4.25rem]",
}: {
  icon: LucideIcon;
  value: string;
  width?: string;
}) => (
  <span
    className={`inline-flex w-auto shrink-0 items-center gap-1.5 text-sm text-muted-foreground ${width}`}
  >
    <Icon className="size-4 shrink-0" />
    <span className="min-w-0 truncate">{value}</span>
  </span>
);

const MetricPlaceholder = () => (
  <span aria-hidden="true" className="hidden w-[4.75rem] shrink-0 lg:block" />
);

const FormerReasonLabel = ({ reason }: { reason: string }) => (
  <span className="inline-flex text-sm text-muted-foreground lg:justify-self-end">
    {reason}
  </span>
);

const ProjectRow = ({ project }: { project: OpenSourceRepository }) => {
  const isFormer = project.status === "former";
  const downloads = project.downloads
    ? formatCompactNumber(project.downloads.total)
    : null;
  const updatedAt = project.pushedAt || project.updatedAt;
  const className = `group/project grid gap-4 py-5 transition-colors lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center ${
    project.url ? "hover:text-foreground" : ""
  } ${isFormer ? "text-muted-foreground opacity-70" : ""}`;
  const content = (
    <>
      <div className="grid min-w-0 gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-medium text-xl leading-tight">
            {isFormer ? project.fullName : project.name}
          </h3>
          {project.url && (
            <ArrowUpRight className="size-4 text-muted-foreground opacity-0 transition-opacity group-hover/project:opacity-100" />
          )}
          {project.language && (
            <Badge variant="outline">
              <span
                className={`size-1.5 rounded-full ${
                  languageColors[project.language] ?? "bg-muted-foreground"
                }`}
              />
              {project.language}
            </Badge>
          )}
        </div>
        {project.description && (
          <p className="max-w-3xl truncate text-muted-foreground">
            {project.description}
          </p>
        )}
      </div>

      {isFormer ? (
        <FormerReasonLabel reason={project.formerReason ?? "Former"} />
      ) : (
        <div className="flex flex-wrap items-center gap-2 lg:grid lg:grid-cols-[5.25rem_4.75rem_4.25rem_4.25rem_7rem] lg:gap-1">
          <DownloadSparkline downloads={project.downloads} />
          {downloads ? (
            <Metric icon={Download} value={downloads} width="lg:w-[4.75rem]" />
          ) : (
            <MetricPlaceholder />
          )}
          <Metric icon={Star} value={formatCompactNumber(project.stars)} />
          <Metric icon={GitFork} value={formatCompactNumber(project.forks)} />
          <Metric
            icon={Clock}
            value={formatRelativeDate(updatedAt)}
            width="lg:w-[7rem]"
          />
        </div>
      )}
    </>
  );

  if (!project.url) {
    return <div className={className}>{content}</div>;
  }

  return (
    <a
      className={className}
      href={project.url}
      key={project.id}
      rel="noopener noreferrer"
      target="_blank"
    >
      {content}
    </a>
  );
};

interface ProjectListProps {
  projects: OpenSourceRepository[];
}

export const ProjectList = ({ projects }: ProjectListProps) => {
  const activeProjects = projects.filter(
    (project) => project.status === "active"
  );
  const formerProjects = projects.filter(
    (project) => project.status === "former"
  );

  return (
    <section className="grid gap-8">
      <h2 className="text-3xl font-medium">All projects</h2>

      {projects.length > 0 ? (
        <div className="divide-y divide-border">
          {activeProjects.map((project) => (
            <ProjectRow key={project.id} project={project} />
          ))}

          {formerProjects.length > 0 && (
            <div className="pt-8">
              <p className="pb-2 text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
                Former
              </p>
              <div className="divide-y divide-border">
                {formerProjects.map((project) => (
                  <ProjectRow key={project.id} project={project} />
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-border p-8 text-muted-foreground">
          GitHub repositories could not be loaded.
        </div>
      )}
    </section>
  );
};
