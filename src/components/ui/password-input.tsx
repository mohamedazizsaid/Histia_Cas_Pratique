"use client";

import { forwardRef, type InputHTMLAttributes, type ReactNode, useState } from "react";
import { cn } from "@/lib/utils";

export type PasswordInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "size"
> & {
  label?: ReactNode;
  errorMessage?: string;
  visibilityLabels?: { show: string; hide: string };
};

const EyeIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
    <line x1="2" x2="22" y1="2" y2="22" />
  </svg>
);

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  (
    {
      label,
      placeholder,
      errorMessage,
      visibilityLabels = { show: "Afficher", hide: "Masquer" },
      className,
      disabled,
      ...props
    },
    ref,
  ) => {
    const [isVisible, setIsVisible] = useState(false);
    const placeholderText = placeholder ?? (typeof label === "string" ? label : undefined);

    return (
      <div className={cn("flex w-full flex-col gap-1.5", className)}>
        <div
          className={cn(
            "flex h-11 w-full items-center gap-2 rounded-lg border bg-white/[0.04] px-3.5 transition-colors",
            errorMessage
              ? "border-danger focus-within:border-danger focus-within:ring-1 focus-within:ring-danger/30"
              : "border-white/15 hover:border-white/25 focus-within:border-white/40 focus-within:ring-1 focus-within:ring-white/20",
            disabled && "cursor-not-allowed opacity-50",
          )}
        >
          <input
            {...props}
            ref={ref}
            type={isVisible ? "text" : "password"}
            placeholder={placeholderText}
            disabled={disabled}
            className="min-w-0 flex-1 bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none"
          />

          <button
            type="button"
            onClick={() => setIsVisible((v) => !v)}
            disabled={disabled}
            aria-label={isVisible ? visibilityLabels.hide : visibilityLabels.show}
            className="flex size-7 items-center justify-center text-white/40 transition-colors hover:text-white/70 focus:outline-none"
          >
            {isVisible ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </div>

        {errorMessage && (
          <p className="text-xs text-danger">{errorMessage}</p>
        )}
      </div>
    );
  },
);

PasswordInput.displayName = "PasswordInput";
