"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { OtpInput } from "@/components/auth/OtpInput";
import { RecoveryCodeForm } from "@/components/auth/RecoveryCodeForm";

const COOLDOWN_SECONDS = 30;
const COOLDOWN_KEY = "mfa_last_sent";

interface VerifyPageClientProps {
  lang: string;
  dict: {
    verify: {
      title: string;
      totpDescription: string;
      emailDescription: string;
      bothDescription: string;
      sendEmailCode: string;
      resendCode: string;
      useRecoveryCode: string;
      useVerificationCode: string;
      backToLogin: string;
    };
    recovery: {
      title: string;
      placeholder: string;
      submit: string;
      description: string;
    };
    errors: Record<string, string>;
    sectors: Record<string, string>;
    companyStatus: Record<string, string>;
  };
}

export function VerifyPageClient({ lang, dict }: VerifyPageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const methods = searchParams.get("methods")?.split(",") ?? [];

  const hasTotp = methods.includes("totp");
  const hasOtp = methods.includes("otp");

  const [view, setView] = useState<"otp" | "recovery">("otp");
  const [serverError, setServerError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [emailSent, setEmailSent] = useState(false);
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Calculate remaining cooldown from localStorage
  const getRemainingCooldown = useCallback(() => {
    const lastSent = Number(localStorage.getItem(COOLDOWN_KEY) || 0);
    if (!lastSent) return 0;
    const elapsed = Math.floor((Date.now() - lastSent) / 1000);
    return Math.max(0, COOLDOWN_SECONDS - elapsed);
  }, []);

  // Start cooldown timer
  const startCooldown = useCallback(() => {
    localStorage.setItem(COOLDOWN_KEY, Date.now().toString());
    setCooldown(COOLDOWN_SECONDS);

    if (cooldownRef.current) clearInterval(cooldownRef.current);
    cooldownRef.current = setInterval(() => {
      const remaining = getRemainingCooldown();
      setCooldown(remaining);
      if (remaining <= 0 && cooldownRef.current) {
        clearInterval(cooldownRef.current);
      }
    }, 1000);
  }, [getRemainingCooldown]);

  // On mount: check existing cooldown + auto-send if email-only
  useEffect(() => {
    const remaining = getRemainingCooldown();
    if (remaining > 0) {
      setCooldown(remaining);
      setEmailSent(true);
      cooldownRef.current = setInterval(() => {
        const r = getRemainingCooldown();
        setCooldown(r);
        if (r <= 0 && cooldownRef.current) {
          clearInterval(cooldownRef.current);
        }
      }, 1000);
    } else if (!hasTotp && hasOtp) {
      // Email-only: auto send code on mount
      sendEmailCode();
    }

    return () => {
      if (cooldownRef.current) clearInterval(cooldownRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendEmailCode = async () => {
    try {
      const result = await authClient.twoFactor.sendOtp();
      if (result.error) {
        if (result.error.status === 429) {
          startCooldown();
        }
      } else {
        setEmailSent(true);
        startCooldown();
      }
    } catch {
      // Silently handle
    }
  };

  const handleOtpComplete = useCallback(
    async (code: string) => {
      setServerError(null);
      setIsVerifying(true);

      try {
        // Determine which verification method to use
        const verifyFn =
          !hasTotp && hasOtp
            ? () => authClient.twoFactor.verifyOtp({ code })
            : emailSent && !hasTotp
              ? () => authClient.twoFactor.verifyOtp({ code })
              : () => authClient.twoFactor.verifyTotp({ code });

        const result = await verifyFn();

        if (result.error) {
          const errCode = result.error.code;
          if (errCode && errCode in dict.errors) {
            setServerError(dict.errors[errCode]);
          } else {
            setServerError(result.error.message ?? "An error occurred");
          }
          return;
        }

        router.push(`/${lang}/dashboard`);
      } catch {
        setServerError("An unexpected error occurred");
      } finally {
        setIsVerifying(false);
      }
    },
    [hasTotp, hasOtp, emailSent, dict.errors, lang, router],
  );

  // Determine description text
  const getDescription = () => {
    if (!hasTotp && hasOtp) return dict.verify.emailDescription;
    if (hasTotp && hasOtp) return dict.verify.bothDescription;
    return dict.verify.totpDescription;
  };

  if (view === "recovery") {
    return (
      <AuthLayout
        lang={lang}
        sectorLabels={dict.sectors}
        statusLabels={dict.companyStatus}
      >
        <RecoveryCodeForm
          lang={lang}
          dict={dict.recovery}
          backLabel={dict.verify.useVerificationCode}
          backToLoginLabel={dict.verify.backToLogin}
          onBack={() => setView("otp")}
          errors={dict.errors}
        />
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      lang={lang}
      sectorLabels={dict.sectors}
      statusLabels={dict.companyStatus}
    >
      <div className="flex flex-col items-center gap-6">
        <h2 className="text-center text-m font-semibold">
          {dict.verify.title}
        </h2>

        {/* OTP Input */}
        <OtpInput
          onComplete={handleOtpComplete}
          disabled={isVerifying}
          error={!!serverError}
        />

        {/* Error */}
        {serverError && (
          <p className="text-center text-sx text-danger">{serverError}</p>
        )}

        {/* Send email code / Resend */}
        {hasOtp && (
          <div className="flex flex-col items-center gap-1">
            {!emailSent && hasTotp && (
              <button
                type="button"
                onClick={sendEmailCode}
                className="cursor-pointer text-sx font-medium text-primary transition-colors hover:text-white"
              >
                {dict.verify.sendEmailCode}
              </button>
            )}
            {emailSent && (
              <button
                type="button"
                onClick={sendEmailCode}
                disabled={cooldown > 0}
                className="cursor-pointer text-sx font-medium text-primary transition-colors hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {dict.verify.resendCode}
                {cooldown > 0 && ` (${cooldown}s)`}
              </button>
            )}
          </div>
        )}

        {/* Recovery code link */}
        <button
          type="button"
          onClick={() => setView("recovery")}
          className="cursor-pointer text-sx text-white/50 transition-colors hover:text-white/70"
        >
          {dict.verify.useRecoveryCode}
        </button>

        {/* Description */}
        <p className="max-w-xs text-center text-xs leading-relaxed text-white/50">
          {getDescription()}
        </p>
      </div>
    </AuthLayout>
  );
}
