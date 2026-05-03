"use client";

import { Button } from "@haydenbleasel/design-system/components/ui/button";
import { Input } from "@haydenbleasel/design-system/components/ui/input";
import { useActionState, useEffect, useRef } from "react";
import { toast } from "sonner";

import { subscribe } from "@/actions/subscribe";

const initialState = {
  error: "",
  message: "",
};

export const emailRegex = /.+@.+/u;

export const Newsletter = () => {
  const [state, formAction, isPending] = useActionState(
    subscribe,
    initialState
  );
  const prevState = useRef(state);

  useEffect(() => {
    if (state === prevState.current) {
      return;
    }
    prevState.current = state;

    if (state.message) {
      toast.success(state.message);
    }
    if (state.error) {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <form action={formAction} className="relative overflow-hidden rounded-full">
      <Input
        aria-label="Email address"
        autoCapitalize="none"
        autoComplete="email"
        className="pr-18 pl-4 md:text-base h-10 border-none"
        id="email"
        name="email"
        placeholder="jane@acme.com"
        required
        type="email"
      />
      <Button
        className="absolute top-0.5 px-4 right-0.5 cursor-pointer"
        disabled={isPending}
        type="submit"
      >
        Join
      </Button>
    </form>
  );
};
