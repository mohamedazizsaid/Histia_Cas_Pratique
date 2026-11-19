"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { authClient } from "@/lib/auth-client";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const COOLDOWN_SECONDS = 30;
const COOLDOWN_KEY = "reset_last_sent";

interface ForgotPasswordClientProps {
  lang: string;
  dict: {
    forgotPassword: {
      title: string;
      description: string;
      submit: string;
      backToLogin: string;
    };
    checkEmail: {
      title: string;
      description: string;
      resendLink: string;
      backToLogin: string;
    };
    auth: { email: string };
    errors: Record<string, string>;
    sectors: Record<string, string>;
    companyStatus: Record<string, string>;
  };
}

export function ForgotPasswordClient({ lang, dict }: ForgotPasswordClientProps) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const getRemainingCooldown = useCallback(() => {
    const lastSent = Number(localStorage.getItem(COOLDOWN_KEY) || 0);
    if (!lastSent) return 0;
    const elapsed = Math.floor((Date.now() - lastSent) / 1000);
    return Math.max(0, COOLDOWN_SECONDS - elapsed);
  }, []);

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

  useEffect(() => {
    const remaining = getRemainingCooldown();
    if (remaining > 0) {
      setCooldown(remaining);
      setSent(true);
      cooldownRef.current = setInterval(() => {
        const r = getRemainingCooldown();
        setCooldown(r);
        if (r <= 0 && cooldownRef.current) {
          clearInterval(cooldownRef.current);
        }
      }, 1000);
    }
    return () => {
      if (cooldownRef.current) clearInterval(cooldownRef.current);
    };
  }, [getRemainingCooldown]);

  const handleSendLink = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    try {
      await authClient.requestPasswordReset({
        email: email.trim(),
        redirectTo: `/${lang}/reset-password`,
      });
      setSent(true);
      startCooldown();
    } catch {
      // API always succeeds whether account exists or not
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = () => {
    if (cooldown > 0 || !email) return;
    handleSendLink();
  };

  return (
    <AuthLayout
      lang={lang}
      sectorLabels={dict.sectors}
      statusLabels={dict.companyStatus}
    >
      {sent ? (
        /* Screen matching Image 9 (Check Email) */
        <div className="flex flex-col items-center">
          <h1 className="mb-2 text-center text-xl font-bold tracking-tight text-white">
            {dict.checkEmail.title}
          </h1>

          <p className="mb-6 max-w-xs text-center text-sm leading-relaxed text-white/50">
            {dict.checkEmail.description}
          </p>

          <div className="flex flex-col items-center gap-2.5">
            <button
              type="button"
              onClick={handleResend}
              disabled={cooldown > 0}
              className="cursor-pointer text-xs text-white/50 transition-colors hover:text-white/75 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {dict.checkEmail.resendLink}
              {cooldown > 0 && ` (${cooldown}s)`}
            </button>

            <a
              href={`/${lang}/login`}
              className="text-xs text-white/50 transition-colors hover:text-white/75"
            >
              {dict.checkEmail.backToLogin}
            </a>
          </div>
        </div>
      ) : (
        /* Screen matching Image 10 (Forgot Password Form) */
        <div className="flex flex-col items-center">
          <h1 className="mb-2 text-center text-xl font-bold tracking-tight text-white">
            {dict.forgotPassword.title}
          </h1>

          <p className="mb-6 max-w-xs text-center text-sm leading-relaxed text-white/50">
            {dict.forgotPassword.description}
          </p>

          <form onSubmit={handleSendLink} className="flex w-full flex-col gap-3.5">
            <Input
              type="email"
              placeholder={dict.auth.email}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
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
              {dict.forgotPassword.submit}
            </Button>
          </form>

          <a
            href={`/${lang}/login`}
            className="mt-4 text-xs text-white/50 transition-colors hover:text-white/75"
          >
            {dict.forgotPassword.backToLogin}
          </a>
        </div>
      )}
    </AuthLayout>
  );
}
