"use client";

import { useRef, useState, useCallback, useEffect, type KeyboardEvent, type ClipboardEvent, type ChangeEvent } from "react";
import { cn } from "@/lib/utils";

interface OtpInputProps {
  length?: number;
  onComplete: (code: string) => void;
  disabled?: boolean;
  error?: boolean;
}

/**
 * OTP_Cell — Figma: 52 × 80, 1px white border, radius 4, digit Inter Semi Bold 32px.
 * Six cells are laid out with a 12px gap (372 × 80 total).
 */
export function OtpInput({ length = 6, onComplete, disabled = false, error = false }: OtpInputProps) {
  const [values, setValues] = useState<string[]>(Array(length).fill(""));
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // Focus first input on mount
  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  // Trigger onComplete when all digits are filled
  useEffect(() => {
    const code = values.join("");
    if (code.length === length && values.every((v) => v !== "")) {
      onComplete(code);
    }
  }, [values, length, onComplete]);

  const focusInput = useCallback((index: number) => {
    const input = inputsRef.current[index];
    if (input) {
      input.focus();
      input.select();
    }
  }, []);

  const handleChange = useCallback(
    (index: number, e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.replace(/\D/g, "");
      if (!value) return;

      const digit = value.slice(-1);
      const newValues = [...values];
      newValues[index] = digit;
      setValues(newValues);

      if (index < length - 1) {
        focusInput(index + 1);
      }
    },
    [values, length, focusInput],
  );

  const handleKeyDown = useCallback(
    (index: number, e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace") {
        e.preventDefault();
        const newValues = [...values];
        if (values[index]) {
          newValues[index] = "";
          setValues(newValues);
        } else if (index > 0) {
          newValues[index - 1] = "";
          setValues(newValues);
          focusInput(index - 1);
        }
      } else if (e.key === "ArrowLeft" && index > 0) {
        e.preventDefault();
        focusInput(index - 1);
      } else if (e.key === "ArrowRight" && index < length - 1) {
        e.preventDefault();
        focusInput(index + 1);
      }
    },
    [values, length, focusInput],
  );

  const handlePaste = useCallback(
    (e: ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
      if (!pasted) return;

      const newValues = Array(length).fill("");
      for (let i = 0; i < pasted.length; i++) {
        newValues[i] = pasted[i];
      }
      setValues(newValues);

      const nextIndex = Math.min(pasted.length, length - 1);
      focusInput(nextIndex);
    },
    [length, focusInput],
  );

  return (
    <div className="flex justify-center gap-2 sm:gap-3">
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(el) => { inputsRef.current[index] = el; }}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={1}
          value={values[index]}
          placeholder="0"
          disabled={disabled}
          onChange={(e) => handleChange(index, e)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          onFocus={(e) => e.target.select()}
          className={cn(
            "flex h-16 w-10 items-center justify-center rounded-[4px] border bg-transparent text-center text-[32px] font-semibold leading-none text-white outline-none transition-all placeholder:text-white/20 sm:h-[80px] sm:w-[52px]",
            error
              ? "border-danger focus:border-danger"
              : "border-white/90 hover:border-white focus:border-white focus:bg-white/[0.04]",
            disabled && "cursor-not-allowed opacity-50",
          )}
          aria-label={`Digit ${index + 1}`}
        />
      ))}
    </div>
  );
}
