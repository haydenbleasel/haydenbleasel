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

import { getAiToken, setAiToken } from "@/lib/ai-token";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SettingsDialog = ({ open, onOpenChange }: Props) => {
  const [token, setToken] = useState("");

  useEffect(() => {
    if (open) {
      setToken(getAiToken());
    }
  }, [open]);

  const handleSave = () => {
    setAiToken(token);
    onOpenChange(false);
  };

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Your{" "}
            <a
              className="underline underline-offset-4"
              href="https://vercel.com/docs/ai-gateway"
              rel="noreferrer"
              target="_blank"
            >
              Vercel AI Gateway
            </a>{" "}
            key is stored only in this browser and sent with each AI request.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-2">
          <Label htmlFor="ai-gateway-key">AI Gateway API key</Label>
          <Input
            autoComplete="off"
            id="ai-gateway-key"
            onChange={(event) => setToken(event.target.value)}
            placeholder="vck_…"
            type="password"
            value={token}
          />
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} variant="ghost">
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
