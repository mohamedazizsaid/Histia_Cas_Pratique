"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface RecoveryCodeFormProps {
  lang: string;
  dict: {
    title: string;
    placeholder: string;
    submit: string;
    description: string;
  };
  backLabel: string;
  backToLoginLabel: string;
  onBack: () => void;
  errors: Record<string, string>;
}

export function RecoveryCodeForm({
  lang,
  dict,
  backLabel,
  onBack,
  errors: errorMessages,
}: RecoveryCodeFormProps) {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setServerError(null);
    setIsLoading(true);

    try {
      const result = await authClient.twoFactor.verifyBackupCode({ code: code.trim() });

      if (result.error) {
        const errCode = result.error.code;
        if (errCode && errCode in errorMessages) {
          setServerError(errorMessages[errCode]);
        } else {
          setServerError(result.error.message ?? "An error occurred");
        }
        return;
      }

      router.push(`/${lang}/dashboard`);
    } catch {
      setServerError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex w-full flex-col items-center gap-10">
      <h1 className="text-center text-[28px] leading-[34px] font-semibold text-white">
        {dict.title}
      </h1>

      <form onSubmit={handleSubmit} className="flex w-full flex-col gap-8">
        {serverError && (
          <div className="rounded-[8px] border border-danger/30 bg-danger/10 px-4 py-2.5 text-center text-[13px] leading-[18px] text-[#e75261]">
            {serverError}
          </div>
        )}

        <Input
          type="text"
          placeholder={dict.placeholder}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          autoFocus
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          alignment="center"
          isLoading={isLoading}
          className="h-[51px] w-full rounded-[8px] px-5 text-[16px] font-semibold leading-none"
        >
          {dict.submit}
        </Button>
      </form>

      {/* Back to verification code */}
      <button
        type="button"
        onClick={onBack}
        className="link-action cursor-pointer text-center"
      >
        {backLabel}
      </button>

      {/* Description */}
      <p className="max-w-[499px] text-center text-[16px] leading-[24px] font-light text-white/80">
        {dict.description}
      </p>
    </div>
  );
}
