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

  // "otp" = 6-digit code screen, "recovery" = recovery code screen
  const [view, setView] = useState<"otp" | "recovery">("otp");
  // Which verification mode is active: totp (app code) or email (emailed code)
  const [activeMode, setActiveMode] = useState<"totp" | "email">(
    hasTotp ? "totp" : "email",
  );
  const [serverError, setServerError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [otpKey, setOtpKey] = useState(0); // key to reset OtpInput
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const getRemainingCooldown = useCallback(() => {
    const lastSent = Number(localStorage.getItem(COOLDOWN_KEY) || 0);
    if (!lastSent) return 0;
    const elapsed = Math.floor((Date.now() - lastSent) / 1000);
    return Math.max(0, COOLDOWN_SECONDS - elapsed);
  }, []);

  const startCooldownTimer = useCallback(() => {
    if (cooldownRef.current) clearInterval(cooldownRef.current);
    cooldownRef.current = setInterval(() => {
      const remaining = getRemainingCooldown();
      setCooldown(remaining);
      if (remaining <= 0 && cooldownRef.current) {
        clearInterval(cooldownRef.current);
      }
    }, 1000);
  }, [getRemainingCooldown]);

  const startCooldown = useCallback(() => {
    localStorage.setItem(COOLDOWN_KEY, Date.now().toString());
    setCooldown(COOLDOWN_SECONDS);
    startCooldownTimer();
  }, [startCooldownTimer]);

  // On mount: restore cooldown if exists, auto-send if email-only
  useEffect(() => {
    const remaining = getRemainingCooldown();
    if (remaining > 0) {
      setCooldown(remaining);
      startCooldownTimer();
    }

    // Email-only: send code automatically
    if (!hasTotp && hasOtp && remaining <= 0) {
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
          // Already rate-limited, start cooldown from server perspective
          startCooldown();
        }
      } else {
        setActiveMode("email");
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
        // Use the right verification method based on active mode
        const result =
          activeMode === "email"
            ? await authClient.twoFactor.verifyOtp({ code })
            : await authClient.twoFactor.verifyTotp({ code });

        if (result.error) {
          const errCode = result.error.code;
          if (errCode && errCode in dict.errors) {
            setServerError(dict.errors[errCode]);
          } else {
            setServerError(result.error.message ?? "An error occurred");
          }
          // Reset OTP input so user can retry
          setOtpKey((k) => k + 1);
          return;
        }

        router.push(`/${lang}/dashboard`);
      } catch {
        setServerError("An unexpected error occurred");
        setOtpKey((k) => k + 1);
      } finally {
        setIsVerifying(false);
      }
    },
    [activeMode, dict.errors, lang, router],
  );

  // Determine description text based on active mode
  const getDescription = () => {
    if (activeMode === "email") {
      return dict.verify.emailDescription;
    }
    if (hasTotp && hasOtp) {
      return dict.verify.bothDescription;
    }
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
          onBack={() => {
            setView("otp");
            setOtpKey((k) => k + 1);
          }}
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

        {/* OTP Input — key forces remount on retry */}
        <OtpInput
          key={otpKey}
          onComplete={handleOtpComplete}
          disabled={isVerifying}
          error={!!serverError}
        />

        {/* Error message */}
        {serverError && (
          <p className="text-center text-sx text-danger">{serverError}</p>
        )}

        {/* Send / Resend email code */}
        {hasOtp && activeMode === "totp" && (
          /* User hasn't requested email code yet — show "Send email code" link */
          <button
            type="button"
            onClick={sendEmailCode}
            disabled={cooldown > 0}
            className="cursor-pointer text-sx font-medium text-primary transition-colors hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {dict.verify.sendEmailCode}
          </button>
        )}

        {hasOtp && activeMode === "email" && (
          /* Email code sent — show resend with cooldown */
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
