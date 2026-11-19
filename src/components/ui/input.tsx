import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size"> & {
  icon?: ReactNode;
  rightElement?: ReactNode;
  inputClassName?: string;
  containerClassName?: string;
  isError?: boolean;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      icon,
      rightElement,
      className,
      inputClassName,
      containerClassName,
      isError,
      disabled,
      ...props
    },
    ref,
  ) => (
    <div className={cn("flex w-full min-w-0 flex-col", containerClassName)}>
      <div
        className={cn(
          "flex h-11 w-full min-w-0 items-center gap-2 rounded-lg border bg-white/[0.04] px-3.5 transition-colors",
          isError
            ? "border-danger focus-within:border-danger focus-within:ring-1 focus-within:ring-danger/30"
            : "border-white/15 hover:border-white/25 focus-within:border-primary-300 focus-within:ring-1 focus-within:ring-primary-300/30",
          disabled && "cursor-not-allowed opacity-50",
          className,
        )}
      >
        {icon && (
          <div className="flex size-5 shrink-0 items-center justify-center text-white/40">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          disabled={disabled}
          className={cn(
            "min-w-0 flex-1 bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none",
            inputClassName,
          )}
          {...props}
        />
        {rightElement && (
          <div className="flex size-5 shrink-0 items-center justify-center text-white/40">
            {rightElement}
          </div>
        )}
      </div>
    </div>
  ),
);

Input.displayName = "Input";
