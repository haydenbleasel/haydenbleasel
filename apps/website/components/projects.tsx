import type { ComponentProps, ReactNode } from "react";
import { Badge } from "@haydenbleasel/design-system/components/ui/badge";

interface Project {
  name: string;
  description: string;
  url: string;
  status?: "Acquired" | "Merged" | "Archived";
  logo: (props: ComponentProps<"svg">) => ReactNode;
}

const UltraciteLogo = (props: ComponentProps<"svg">) => (
  <svg fill="none" viewBox="0 0 507 508" xmlns="http://www.w3.org/2000/svg" {...props}>
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
  <svg fill="none" viewBox="0 0 118 118" xmlns="http://www.w3.org/2000/svg" {...props}>
    <title>Eververse</title>
    <path
      d="M59.3377 117.036C63.1496 117.036 66.2732 114.231 66.8024 110.26C72.0434 74.8953 76.861 69.9718 110.85 66.1073C114.767 65.6308 117.785 62.3486 117.785 58.5368C117.785 54.6717 114.82 51.4954 110.902 50.913C77.1259 46.2012 72.9438 42.0718 66.8024 6.76032C66.1142 2.84261 63.0964 0.036499 59.3377 0.036499C55.4732 0.036499 52.4022 2.84261 51.7671 6.81298C46.632 42.125 41.8144 47.0485 7.87879 50.913C3.85524 51.4427 0.890625 54.619 0.890625 58.5368C0.890625 62.3486 3.7494 65.5249 7.77295 66.1073C41.6022 70.9249 45.7316 75.0012 51.7671 110.313C52.5612 114.284 55.6317 117.036 59.3377 117.036Z"
      fill="currentColor"
    />
  </svg>
);

const KiboLogo = (props: ComponentProps<"svg">) => (
  <svg fill="none" viewBox="0 0 116 116" xmlns="http://www.w3.org/2000/svg" {...props}>
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
  <svg viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <title>Ghost</title>
    <path
      d="M12.5 7C12.5 3.96243 10.0376 1.5 7 1.5C3.96243 1.5 1.5 3.96243 1.5 7V14.2754L1.91992 13.8848C2.79553 13.0691 4.09852 12.9133 5.1416 13.5L6.87695 14.4766C6.95321 14.5194 7.04679 14.5194 7.12305 14.4766L8.8584 13.5C9.9015 12.9133 11.2045 13.0691 12.0801 13.8848L12.5 14.2754V7ZM14 14.667C14 15.8294 12.6139 16.4319 11.7637 15.6396L11.0576 14.9824C10.6598 14.6118 10.0677 14.541 9.59375 14.8076L7.8584 15.7842C7.32581 16.0835 6.67516 16.0835 6.14258 15.7842L4.40625 14.8076C3.93237 14.5411 3.34025 14.6118 2.94238 14.9824L2.23633 15.6396C1.38606 16.4319 0 15.8294 0 14.667V7C0 3.13401 3.13401 0 7 0C10.866 0 14 3.13401 14 7V14.667Z"
      fill="currentColor"
    />
    <path
      d="M4 6C4 5.44772 4.44772 5 5 5C5.55222 5 6 5.44769 6 6C6 6.55224 5.55224 7 5 7C4.44769 7 4 6.55222 4 6Z"
      fill="currentColor"
    />
    <path
      d="M8 6C8 5.44769 8.44778 5 9 5C9.55222 5 10 5.44769 10 6C10 6.55224 9.55224 7 9 7C8.44776 7 8 6.55224 8 6Z"
      fill="currentColor"
    />
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

export const Projects = () => (
  <div className="grid gap-6 sm:gap-2">
    {projects.map((project) => (
      <a
        className="group flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 no-underline"
        href={project.url}
        key={project.name}
        rel="noopener noreferrer"
        target="_blank"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
          <project.logo className="size-4 text-foreground transition-colors group-hover:text-muted-foreground mb-2 sm:mb-0" />
          <p className="font-medium text-foreground transition-colors group-hover:text-muted-foreground">
            {project.name}
          </p>
          <p className="text-sm">{project.description}</p>
        </div>
        {project.status ? (
          <Badge variant="outline" className="bg-transparent font-normal text-muted-foreground">
            {project.status}
          </Badge>
        ) : null}
      </a>
    ))}
  </div>
);
