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
    <div className="flex flex-col items-center">
      <h1 className="mb-6 text-center text-xl font-bold tracking-tight text-white">
        {dict.title}
      </h1>

      {serverError && (
        <div className="mb-4 w-full rounded-lg border border-danger/30 bg-danger/10 px-3.5 py-2.5 text-center text-xs text-danger">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex w-full flex-col gap-3.5">
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
          className="mt-2 h-11 w-full rounded-lg text-sm font-medium"
        >
          {dict.submit}
        </Button>
      </form>

      {/* Back to verification code */}
      <button
        type="button"
        onClick={onBack}
        className="mt-4 cursor-pointer text-xs text-white/50 transition-colors hover:text-white/75"
      >
        {backLabel}
      </button>

      {/* Description below link matching Image 5 */}
      <p className="mt-4 max-w-xs text-center text-xs leading-relaxed text-white/40">
        {dict.description}
      </p>
    </div>
  );
}
