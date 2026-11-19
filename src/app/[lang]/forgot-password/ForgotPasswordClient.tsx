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

  // Check existing cooldown on mount
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
      // The API always returns success whether the account exists or not
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = () => {
    if (cooldown > 0) return;
    handleSendLink();
  };

  if (sent) {
    return (
      <AuthLayout
        lang={lang}
        sectorLabels={dict.sectors}
        statusLabels={dict.companyStatus}
      >
        <div className="flex flex-col items-center gap-6">
          <h2 className="text-center text-m font-semibold">
            {dict.checkEmail.title}
          </h2>
          <p className="max-w-sm text-center text-sx leading-relaxed text-white/60">
            {dict.checkEmail.description}
          </p>

          {/* Resend link with cooldown */}
          <button
            type="button"
            onClick={handleResend}
            disabled={cooldown > 0}
            className="cursor-pointer text-sx font-semibold text-white transition-colors hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            {dict.checkEmail.resendLink}
            {cooldown > 0 && ` (${cooldown}s)`}
          </button>

          {/* Back to login */}
          <a
            href={`/${lang}/login`}
            className="text-sx text-white/50 transition-colors hover:text-white/70"
          >
            {dict.checkEmail.backToLogin}
          </a>
        </div>
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
          {dict.forgotPassword.title}
        </h2>
        <p className="max-w-sm text-center text-sx leading-relaxed text-white/60">
          {dict.forgotPassword.description}
        </p>

        <form onSubmit={handleSendLink} className="flex w-full flex-col gap-4">
          <Input
            type="email"
            placeholder={dict.auth.email}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            {dict.forgotPassword.submit}
          </Button>
        </form>

        {/* Back to login */}
        <a
          href={`/${lang}/login`}
          className="text-sx text-white/50 transition-colors hover:text-white/70"
        >
          {dict.forgotPassword.backToLogin}
        </a>
      </div>
    </AuthLayout>
  );
}
