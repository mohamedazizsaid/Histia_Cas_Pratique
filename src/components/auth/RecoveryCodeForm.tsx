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
  backToLoginLabel,
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
    <div className="flex flex-col items-center gap-6">
      <h2 className="text-center text-m font-semibold">{dict.title}</h2>

      {serverError && (
        <div className="w-full rounded-sm bg-danger/10 px-4 py-2.5 text-sx text-danger">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
        <Input
          type="text"
          placeholder={dict.placeholder}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="rounded-sm border border-white/40 bg-black/10 px-4 py-2.5"
          inputClassName="h-7 text-lg placeholder:text-white/40"
          autoFocus
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          alignment="center"
          textSize="base"
          isLoading={isLoading}
          className="w-full"
        >
          {dict.submit}
        </Button>
      </form>

      {/* Back to verification code */}
      <button
        type="button"
        onClick={onBack}
        className="cursor-pointer text-sx font-medium text-primary transition-colors hover:text-white"
      >
        {backLabel}
      </button>

      <p className="max-w-xs text-center text-xs leading-relaxed text-white/50">
        {dict.description}
      </p>

      {/* Back to login */}
      <a
        href={`/${lang}/login`}
        className="text-xs text-white/40 transition-colors hover:text-white/60"
      >
        {backToLoginLabel}
      </a>
    </div>
  );
}
