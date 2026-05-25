"use client";

import { Button } from "@haydenbleasel/design-system/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@haydenbleasel/design-system/components/ui/dialog";
import { Input } from "@haydenbleasel/design-system/components/ui/input";
import { Label } from "@haydenbleasel/design-system/components/ui/label";
import { useEffect, useState } from "react";

import { isValidPath } from "@/lib/patterns";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (name: string) => void;
}

export const NewPatternDialog = ({ open, onOpenChange, onCreate }: Props) => {
  const [name, setName] = useState("");

  useEffect(() => {
    if (open) {
      setName("");
    }
  }, [open]);

  const trimmed = name.trim().replaceAll(/^\/+|\/+$/gu, "");
  const valid = trimmed.length > 0 && isValidPath(trimmed);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!valid) {
      return;
    }
    onCreate(trimmed);
    onOpenChange(false);
  };

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>New pattern</DialogTitle>
            <DialogDescription>
              Use slashes to group patterns into folders, e.g.{" "}
              <code>drums/breakbeat</code>.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-2 py-4">
            <Label htmlFor="pattern-name">Name</Label>
            <Input
              autoComplete="off"
              id="pattern-name"
              onChange={(event) => setName(event.target.value)}
              placeholder="untitled"
              value={name}
            />
          </div>
          <DialogFooter>
            <Button
              onClick={() => onOpenChange(false)}
              type="button"
              variant="ghost"
            >
              Cancel
            </Button>
            <Button disabled={!valid} type="submit">
              Create
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
