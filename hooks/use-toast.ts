"use client";

import { toast as sonner } from "sonner";

type ToastOptions = {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
};

export function useToast() {
  return {
    toast: ({ title, description, variant }: ToastOptions) => {
      const message = title
        ? `${title}${description ? `: ${description}` : ""}`
        : (description ?? "");

      if (variant === "destructive") {
        sonner.error(message);
      } else {
        sonner(message);
      }
    },
  };
}
