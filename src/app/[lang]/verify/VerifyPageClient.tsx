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
  const [otpKey, setOtpKey] = useState(0);
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

  useEffect(() => {
    const remaining = getRemainingCooldown();
    if (remaining > 0) {
      setCooldown(remaining);
      startCooldownTimer();
    }

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
      <div className="flex w-full flex-col items-center gap-10">
        <h1 className="text-center text-[28px] leading-[34px] font-semibold text-white">
          {dict.verify.title}
        </h1>

        {/* OTP cells + actions */}
        <div className="flex flex-col items-center gap-3">
          <OtpInput
            key={otpKey}
            onComplete={handleOtpComplete}
            disabled={isVerifying}
            error={!!serverError}
          />

          {serverError && (
            <p className="max-w-[372px] text-center text-[13px] leading-[18px] text-danger">
              {serverError}
            </p>
          )}

          <div className="flex flex-col items-center gap-1">
            {/* Send an email code while the app code is active */}
            {hasOtp && activeMode === "totp" && (
              <button
                type="button"
                onClick={sendEmailCode}
                className="link-action cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
              >
                {dict.verify.sendEmailCode}
              </button>
            )}

            {/* Resend the email code, with the 30s cooldown */}
            {hasOtp && activeMode === "email" && (
              <button
                type="button"
                onClick={sendEmailCode}
                disabled={cooldown > 0}
                className="link-action cursor-pointer disabled:cursor-not-allowed"
              >
                <span className={cooldown > 0 ? "opacity-50" : undefined}>
                  {dict.verify.resendCode}
                </span>
                {cooldown > 0 && (
                  <span className="font-light text-white/80"> ({cooldown}s)</span>
                )}
              </button>
            )}

            <button
              type="button"
              onClick={() => setView("recovery")}
              className="link-action cursor-pointer"
            >
              {dict.verify.useRecoveryCode}
            </button>
          </div>
        </div>

        <p className="max-w-[499px] text-center text-[16px] leading-[24px] font-light text-white/80">
          {getDescription()}
        </p>
      </div>
    </AuthLayout>
  );
}
