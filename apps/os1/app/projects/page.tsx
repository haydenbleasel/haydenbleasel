import { Badge } from "@haydenbleasel/design-system/components/ui/badge";
import type { Metadata } from "next";
import type { ComponentProps, ReactNode } from "react";

import { PageBody, PageHeader } from "@/components/page-header";

export const metadata: Metadata = {
  description: "Things I've designed, built and shipped.",
  title: "Projects | OS1",
};

interface Project {
  name: string;
  description: string;
  url: string;
  status?: "Acquired" | "Merged" | "Archived";
  logo: (props: ComponentProps<"svg">) => ReactNode;
}

const UltraciteLogo = (props: ComponentProps<"svg">) => (
  <svg
    fill="none"
    viewBox="0 0 507 508"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <title>Ultracite</title>
    <path
      d="M318.661 13.3835L268.715 0L226.623 157.087L188.623 15.2678L138.674 28.6513L179.732 181.876L77.4678 79.6125L40.9035 116.177L153.075 228.349L13.3834 190.918L0 240.865L152.63 281.763C150.882 274.225 149.958 266.372 149.958 258.303C149.958 201.186 196.26 154.883 253.378 154.883C310.495 154.883 356.797 201.186 356.797 258.303C356.797 266.32 355.884 274.125 354.158 281.618L492.869 318.785L506.251 268.838L353.016 227.778L492.718 190.346L479.332 140.399L326.102 181.456L428.366 79.1929L391.801 42.6286L281.186 153.244L318.661 13.3835Z"
      fill="currentColor"
    />
    <path
      d="M354.009 282.198C349.727 300.302 340.686 316.567 328.281 329.597L428.772 430.09L465.336 393.525L354.009 282.198Z"
      fill="currentColor"
    />
    <path
      d="M327.264 330.651C314.709 343.474 298.844 353.043 281.052 357.974L317.619 494.442L367.566 481.06L327.264 330.651Z"
      fill="currentColor"
    />
    <path
      d="M279.195 358.47C270.94 360.592 262.288 361.72 253.372 361.72C243.819 361.72 234.569 360.425 225.787 358L189.187 494.595L239.134 507.976L279.195 358.47Z"
      fill="currentColor"
    />
    <path
      d="M224.015 357.498C206.495 352.321 190.911 342.631 178.613 329.771L77.8749 430.509L114.439 467.074L224.015 357.498Z"
      fill="currentColor"
    />
    <path
      d="M177.789 328.881C165.702 315.94 156.898 299.893 152.707 282.068L13.5416 319.357L26.9249 369.304L177.789 328.881Z"
      fill="currentColor"
    />
  </svg>
);

const EververseLogo = (props: ComponentProps<"svg">) => (
  <svg
    fill="none"
    viewBox="0 0 118 118"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <title>Eververse</title>
    <path
      d="M59.3377 117.036C63.1496 117.036 66.2732 114.231 66.8024 110.26C72.0434 74.8953 76.861 69.9718 110.85 66.1073C114.767 65.6308 117.785 62.3486 117.785 58.5368C117.785 54.6717 114.82 51.4954 110.902 50.913C77.1259 46.2012 72.9438 42.0718 66.8024 6.76032C66.1142 2.84261 63.0964 0.036499 59.3377 0.036499C55.4732 0.036499 52.4022 2.84261 51.7671 6.81298C46.632 42.125 41.8144 47.0485 7.87879 50.913C3.85524 51.4427 0.890625 54.619 0.890625 58.5368C0.890625 62.3486 3.7494 65.5249 7.77295 66.1073C41.6022 70.9249 45.7316 75.0012 51.7671 110.313C52.5612 114.284 55.6317 117.036 59.3377 117.036Z"
      fill="currentColor"
    />
  </svg>
);

const KiboLogo = (props: ComponentProps<"svg">) => (
  <svg
    fill="none"
    viewBox="0 0 116 116"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <title>Kibo UI</title>
    <path
      clipRule="evenodd"
      d="m29.3378 0h87.0002v87l-29.0002 29v-87h-87.000031zm-29.000031 95.7389v-37.7389h37.738831zm58.000031 20.2611h-37.249l37.249-37.2488z"
      fill="currentColor"
      fillRule="evenodd"
    />
  </svg>
);

const OrateLogo = (props: ComponentProps<"svg">) => (
  <svg
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <title>Orate</title>
    <path d="m10 9-3 3 3 3" />
    <path d="m14 15 3-3-3-3" />
    <path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719" />
  </svg>
);

const RefractionLogo = (props: ComponentProps<"svg">) => (
  <svg
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <title>Refraction</title>
    <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
    <path d="m3.3 7 8.7 5 8.7-5" />
    <path d="M12 22V12" />
  </svg>
);

const NextForgeLogo = (props: ComponentProps<"svg">) => (
  <svg
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <title>next-forge</title>
    <path d="M10 22V7a1 1 0 0 0-1-1H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5a1 1 0 0 0-1-1H2" />
    <rect height="8" rx="1" width="8" x="14" y="2" />
  </svg>
);

const GhostLogo = (props: ComponentProps<"svg">) => (
  <svg
    viewBox="0 0 25 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <title>Ghost</title>
    <path d="M12 24H13V25H11V23H12V24Z" fill="var(--border)" />
    <path
      d="M6 19H7V20H8V14H9V17H10V21H11V23H10V22H9V21H8V22H7V23H6V20H5V13H4V15H3V14H2V13H3V12H5V10H6V19Z"
      fill="var(--border)"
    />
    <path
      d="M22 13H21V14H20V13H19V17H20V18H21V20H22V22H23V23H24V24H21V22H20V21H19V20H18V19H17V14H18V12H21V11H22V13Z"
      fill="var(--border)"
    />
    <path d="M15 11H16V13H15V11Z" fill="var(--border)" />
    <path
      d="M13 16H14V18H15V20H16V21H17V22H19V23H18V24H17V25H14V20H13V17H12V14H13V16Z"
      fill="var(--border)"
    />
    <path d="M9 7H10V9H9V10H8V9H7V7H8V6H9V7Z" fill="currentColor" />
    <path d="M10 10H12V11H10V10Z" fill="currentColor" />
    <path d="M14 7H15V9H14V10H13V9H12V7H13V6H14V7Z" fill="currentColor" />
    <path d="M13 26H11V25H13V26Z" fill="currentColor" />
    <path d="M17 26H14V25H17V26Z" fill="currentColor" />
    <path d="M11 25H10V23H11V25Z" fill="currentColor" />
    <path d="M14 25H13V24H14V25Z" fill="currentColor" />
    <path d="M18 25H17V24H18V25Z" fill="currentColor" />
    <path d="M24 25H21V24H24V25Z" fill="currentColor" />
    <path d="M7 24H6V23H7V24Z" fill="currentColor" />
    <path d="M13 24H12V23H13V24Z" fill="currentColor" />
    <path d="M21 24H18V23H21V24Z" fill="currentColor" />
    <path d="M25 24H24V23H25V24Z" fill="currentColor" />
    <path d="M6 23H5V20H6V23Z" fill="currentColor" />
    <path d="M8 23H7V22H8V23Z" fill="currentColor" />
    <path d="M10 23H9V22H10V23Z" fill="currentColor" />
    <path d="M24 23H23V22H24V23Z" fill="currentColor" />
    <path d="M9 22H8V21H9V22Z" fill="currentColor" />
    <path d="M23 22H22V20H23V22Z" fill="currentColor" />
    <path d="M5 20H4V16H3V15H4V13H5V20Z" fill="currentColor" />
    <path d="M22 20H21V18H22V20Z" fill="currentColor" />
    <path d="M21 18H20V17H21V18Z" fill="currentColor" />
    <path d="M20 14H21V15H20V17H19V13H20V14Z" fill="currentColor" />
    <path d="M3 15H2V14H3V15Z" fill="currentColor" />
    <path d="M2 14H1V13H2V14Z" fill="currentColor" />
    <path d="M22 14H21V13H22V14Z" fill="currentColor" />
    <path d="M1 13H0V9H1V13Z" fill="currentColor" />
    <path d="M23 13H22V10H23V13Z" fill="currentColor" />
    <path d="M17 11H16V10H17V11Z" fill="currentColor" />
    <path d="M6 10H5V9H4V8H5V5H6V10Z" fill="currentColor" />
    <path d="M18 10H17V9H18V10Z" fill="currentColor" />
    <path d="M22 10H21V9H22V10Z" fill="currentColor" />
    <path d="M2 9H1V8H2V9Z" fill="currentColor" />
    <path d="M19 8H21V9H18V5H19V8Z" fill="currentColor" />
    <path d="M4 8H2V7H4V8Z" fill="currentColor" />
    <path d="M7 5H6V3H7V5Z" fill="currentColor" />
    <path d="M18 5H17V3H18V5Z" fill="currentColor" />
    <path d="M8 3H7V2H8V3Z" fill="currentColor" />
    <path d="M17 3H16V2H17V3Z" fill="currentColor" />
    <path d="M10 2H8V1H10V2Z" fill="currentColor" />
    <path d="M16 2H14V1H16V2Z" fill="currentColor" />
    <path d="M14 1H10V0H14V1Z" fill="currentColor" />
    <path
      d="M20 30H21V31H18V32H9V31H5V30H6V29H8V28H18V29H20V30Z"
      fill="currentColor"
    />
  </svg>
);

const FilesSDKLogo = (props: ComponentProps<"svg">) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 256 256"
    {...props}
  >
    <title>Files SDK</title>
    <path
      d="M208,72V184a8,8,0,0,1-8,8H176V104L136,64H80V40a8,8,0,0,1,8-8h80Z"
      opacity="0.2"
    />
    <path d="M213.66,66.34l-40-40A8,8,0,0,0,168,24H88A16,16,0,0,0,72,40V56H56A16,16,0,0,0,40,72V216a16,16,0,0,0,16,16H168a16,16,0,0,0,16-16V200h16a16,16,0,0,0,16-16V72A8,8,0,0,0,213.66,66.34ZM168,216H56V72h76.69L168,107.31v84.53c0,.06,0,.11,0,.16s0,.1,0,.16V216Zm32-32H184V104a8,8,0,0,0-2.34-5.66l-40-40A8,8,0,0,0,136,56H88V40h76.69L200,75.31Zm-56-32a8,8,0,0,1-8,8H88a8,8,0,0,1,0-16h48A8,8,0,0,1,144,152Zm0,32a8,8,0,0,1-8,8H88a8,8,0,0,1,0-16h48A8,8,0,0,1,144,184Z" />
  </svg>
);

const projects: Project[] = [
  {
    description: "Robust, zero-config linter/formatter preset.",
    logo: UltraciteLogo,
    name: "Ultracite",
    url: "https://www.ultracite.ai",
  },
  {
    description: "A unified storage SDK for object and blob backends.",
    logo: FilesSDKLogo,
    name: "Files SDK",
    url: "https://files-sdk.dev",
  },
  {
    description: "Simple, reliable dedicated game servers.",
    logo: GhostLogo,
    name: "Ghost",
    url: "https://github.com/haydenbleasel/ghost",
  },
  {
    description: "A UI library for building web applications.",
    logo: KiboLogo,
    name: "Kibo UI",
    status: "Acquired",
    url: "https://www.shadcnblocks.com/blog/announcing-kibo-ui-acquisition/",
  },
  {
    description: "Learn, improve and generate code with AI.",
    logo: RefractionLogo,
    name: "Refraction",
    status: "Acquired",
    url: "https://x.com/haydenbleasel/status/1678770475647012864",
  },
  {
    description: "Production-grade Turborepo template.",
    logo: NextForgeLogo,
    name: "next-forge",
    status: "Acquired",
    url: "https://x.com/haydenbleasel/status/1929625673586598148",
  },
  {
    description: "AI toolkit for transcribing and synthesizing speech.",
    logo: OrateLogo,
    name: "Orate",
    status: "Merged",
    url: "https://x.com/haydenbleasel/status/1931033287851675688",
  },
  {
    description: "The open source product management platform.",
    logo: EververseLogo,
    name: "Eververse",
    status: "Archived",
    url: "https://github.com/haydenbleasel/eververse",
  },
];

const ProjectsPage = () => (
  <>
    <PageHeader
      title="Projects"
      description="Things I've designed, built and shipped."
    />

    <PageBody>
      <section className="flex flex-col gap-2 rounded-2xl bg-sidebar p-2">
        <div className="grid gap-2 rounded-2xl bg-background p-2 shadow-sm/5">
          {projects.map((project) => (
            <a
              className="group flex flex-col gap-2 rounded-lg px-3 py-2 no-underline transition-colors hover:bg-accent sm:flex-row sm:items-center sm:justify-between sm:gap-4"
              href={project.url}
              key={project.name}
              rel="noopener noreferrer"
              target="_blank"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                <project.logo className="size-4 shrink-0 text-foreground" />
                <p className="font-medium text-foreground">{project.name}</p>
                <p className="text-sm text-muted-foreground">
                  {project.description}
                </p>
              </div>
              {project.status ? (
                <Badge
                  variant="outline"
                  className="shrink-0 bg-transparent font-normal text-muted-foreground"
                >
                  {project.status}
                </Badge>
              ) : null}
            </a>
          ))}
        </div>
      </section>
    </PageBody>
  </>
);

export default ProjectsPage;
