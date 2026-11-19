import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size"> & {
  icon?: ReactNode;
  rightElement?: ReactNode;
  inputClassName?: string;
  containerClassName?: string;
  isError?: boolean;
};

/**
 * Text_Field — Figma: 49px high, padding 16px 20px, white 5% background,
 * 1px white 40% border, radius 8, Inter Regular 14px.
 */
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
          "flex h-[49px] w-full min-w-0 items-center gap-2 rounded-[8px] border border-white/40 bg-white/5 px-5 transition-colors",
          isError
            ? "border-danger focus-within:border-danger focus-within:ring-1 focus-within:ring-danger/25"
            : "hover:border-white/55 focus-within:border-white/70 focus-within:bg-white/[0.07] focus-within:ring-1 focus-within:ring-white/20",
          disabled && "cursor-not-allowed opacity-50",
          className,
        )}
      >
        {icon && (
          <div className="flex size-5 shrink-0 items-center justify-center text-white/70">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          disabled={disabled}
          className={cn(
            "min-w-0 flex-1 bg-transparent text-[14px] leading-[20px] font-normal text-white placeholder:text-white/80 focus:outline-none",
            inputClassName,
          )}
          {...props}
        />
        {rightElement && (
          <div className="flex size-5 shrink-0 items-center justify-center text-white/70">
            {rightElement}
          </div>
        )}
      </div>
    </div>
  ),
);

Input.displayName = "Input";
