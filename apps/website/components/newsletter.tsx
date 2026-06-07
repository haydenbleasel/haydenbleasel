"use client";

import { useActionState, useEffect, useRef } from "react";
import { toast } from "sonner";

import { subscribe } from "@/actions/subscribe";

const initialState = {
  error: "",
  message: "",
};

const ArrowRightIcon = () => (
  <svg
    aria-hidden="true"
    className="size-4"
    fill="none"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M5 12h14m-6-6 6 6-6 6"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
  </svg>
);

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
    <form
      action={formAction}
      className="relative flex h-12 w-full items-center overflow-hidden rounded-full bg-[#fafafa]"
    >
      <input
        aria-label="Email address"
        autoCapitalize="none"
        autoComplete="email"
        className="h-12 border-none outline-none w-full bg-transparent pl-6 pr-16 text-base shadow-none placeholder:text-black/50 focus-visible:ring-0 focus-visible:ring-offset-0"
        id="email"
        name="email"
        placeholder="annie@acme.com"
        required
        type="email"
      />
      <button
        aria-label={isPending ? "Joining mailing list" : "Join mailing list"}
        className="absolute right-0.5 top-0.5 flex items-center justify-center size-11 cursor-pointer rounded-full bg-primary p-0 text-white hover:bg-primary/80"
        disabled={isPending}
        type="submit"
      >
        <ArrowRightIcon />
      </button>
    </form>
  );
};
