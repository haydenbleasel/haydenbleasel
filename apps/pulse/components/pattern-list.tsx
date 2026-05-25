import { Button } from "@haydenbleasel/design-system/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@haydenbleasel/design-system/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@haydenbleasel/design-system/components/ui/sidebar";
import { ChevronRight, Plus, Settings } from "lucide-react";
import Link from "next/link";

import type { PatternRef } from "@/lib/patterns";

interface Props {
  patterns: PatternRef[];
  active: PatternRef | null;
  onNewPattern: () => void;
  onOpenSettings: () => void;
}

interface TreeNode {
  name: string;
  fullPath?: string;
  children: TreeNode[];
}

const sortNode = (n: TreeNode) => {
  n.children.sort((a, b) => {
    const aIsFolder = a.children.length > 0;
    const bIsFolder = b.children.length > 0;
    if (aIsFolder !== bIsFolder) {
      return aIsFolder ? -1 : 1;
    }
    return a.name.localeCompare(b.name);
  });
  for (const child of n.children) {
    sortNode(child);
  }
};

const buildTree = (paths: PatternRef[]): TreeNode => {
  const root: TreeNode = { children: [], name: "" };
  for (const p of paths) {
    const segs = p.split("/");
    let node = root;
    for (const [i, seg] of segs.entries()) {
      let child = node.children.find((c) => c.name === seg);
      if (!child) {
        child = { children: [], name: seg };
        node.children.push(child);
      }
      if (i === segs.length - 1) {
        child.fullPath = p;
      }
      node = child;
    }
  }
  sortNode(root);
  return root;
};

const isOpenForActive = (node: TreeNode, active: PatternRef | null): boolean =>
  active !== null &&
  node.children.some(
    (c) => c.fullPath === active || isOpenForActive(c, active)
  );

const SubTree = ({
  node,
  active,
}: {
  node: TreeNode;
  active: PatternRef | null;
}) => {
  if (node.fullPath && node.children.length === 0) {
    return (
      <SidebarMenuSubItem>
        <SidebarMenuSubButton asChild isActive={node.fullPath === active}>
          <Link href={`/${node.fullPath}`}>
            <span>{node.name}</span>
          </Link>
        </SidebarMenuSubButton>
      </SidebarMenuSubItem>
    );
  }
  return (
    <Collapsible
      className="group/sub-collapsible"
      defaultOpen={isOpenForActive(node, active)}
    >
      <SidebarMenuSubItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuSubButton>
            <ChevronRight className="transition-transform group-data-[state=open]/sub-collapsible:rotate-90" />
            <span>{node.name}</span>
          </SidebarMenuSubButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {node.children.map((child) => (
              <SubTree active={active} key={child.name} node={child} />
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuSubItem>
    </Collapsible>
  );
};

const TopLevelChild = ({
  node,
  active,
}: {
  node: TreeNode;
  active: PatternRef | null;
}) => {
  if (node.fullPath && node.children.length === 0) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton asChild isActive={node.fullPath === active}>
          <Link href={`/${node.fullPath}`}>
            <span>{node.name}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }
  return (
    <Collapsible
      className="group/collapsible"
      defaultOpen={isOpenForActive(node, active)}
    >
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton>
            <ChevronRight className="transition-transform group-data-[state=open]/collapsible:rotate-90" />
            <span>{node.name}</span>
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {node.children.map((child) => (
              <SubTree active={active} key={child.name} node={child} />
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
};

export const PatternList = ({
  patterns,
  active,
  onNewPattern,
  onOpenSettings,
}: Props) => {
  const tree = buildTree(patterns);

  return (
    <Sidebar>
      <SidebarHeader className="border-b h-12">
        <div className="flex items-center justify-between px-2">
          <p className="font-semibold text-sm">Pulse</p>
          <Button
            aria-label="New pattern"
            onClick={onNewPattern}
            size="icon-sm"
            variant="ghost"
          >
            <Plus />
          </Button>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {tree.children.length === 0 ? (
          <div className="px-4 py-3 text-muted-foreground text-xs">
            No patterns yet.
          </div>
        ) : (
          tree.children.map((group) => (
            <SidebarGroup key={group.name}>
              <SidebarGroupLabel>{group.name}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.fullPath && group.children.length === 0 ? (
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        asChild
                        isActive={group.fullPath === active}
                      >
                        <Link href={`/${group.fullPath}`}>
                          <span>{group.name}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ) : (
                    group.children.map((child) => (
                      <TopLevelChild
                        active={active}
                        key={child.name}
                        node={child}
                      />
                    ))
                  )}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))
        )}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={onOpenSettings} tooltip="Settings">
              <Settings />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};
