import { SidebarTrigger } from "@haydenbleasel/design-system/components/ui/sidebar";
import { cn } from "@haydenbleasel/design-system/lib/utils";
import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  /**
   * Removes the bottom padding so tabs (or other navigation) passed as
   * children sit flush against the header's bottom border.
   */
  withTabs?: boolean;
  children?: ReactNode;
}

export const PageHeader = ({ title, withTabs, children }: PageHeaderProps) => (
  <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur">
    <div
      className={cn(
        "w-full max-w-6xl px-4 pt-4 md:px-12 md:pt-12",
        withTabs ? "pb-0" : "pb-8"
      )}
    >
      <SidebarTrigger className="-ml-2 mb-2 md:hidden" />
      <h1 className="font-medium text-4xl tracking-tight">{title}</h1>
      {children ? (
        <div className={cn(withTabs && "mt-6")}>{children}</div>
      ) : null}
    </div>
  </header>
);

export const PageBody = ({ children }: { children: ReactNode }) => (
  <div className="flex w-full max-w-6xl flex-col gap-8 px-4 py-8 md:px-12">
    {children}
  </div>
);
