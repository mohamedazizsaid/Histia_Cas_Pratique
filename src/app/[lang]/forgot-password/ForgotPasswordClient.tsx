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
        /* Vérifiez votre boîte courriel */
        <div className="flex w-full flex-col items-center gap-10">
          <header className="flex flex-col items-center gap-3 text-center">
            <h1 className="text-[28px] leading-[34px] font-semibold text-white">
              {dict.checkEmail.title}
            </h1>
            <p className="max-w-[499px] text-[16px] leading-[24px] font-light text-white/80">
              {dict.checkEmail.description}
            </p>
          </header>

          <div className="flex flex-col items-center gap-4">
            <button
              type="button"
              onClick={handleResend}
              disabled={cooldown > 0}
              className="link-action cursor-pointer disabled:cursor-not-allowed"
            >
              <span className={cooldown > 0 ? "opacity-50" : undefined}>
                {dict.checkEmail.resendLink}
              </span>
              {cooldown > 0 && (
                <span className="font-light text-white/80"> ({cooldown}s)</span>
              )}
            </button>

            <a href={`/${lang}/login`} className="link-action">
              {dict.checkEmail.backToLogin}
            </a>
          </div>
        </div>
      ) : (
        /* Mot de passe oublié ? */
        <div className="flex w-full flex-col items-center gap-10">
          <header className="flex flex-col items-center gap-3 text-center">
            <h1 className="text-[28px] leading-[34px] font-semibold text-white">
              {dict.forgotPassword.title}
            </h1>
            <p className="max-w-[499px] text-[16px] leading-[24px] font-light text-white/80">
              {dict.forgotPassword.description}
            </p>
          </header>

          <form onSubmit={handleSendLink} className="flex w-full flex-col gap-8">
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
              className="h-[51px] w-full rounded-[8px] px-5 text-[16px] font-semibold leading-none"
            >
              {dict.forgotPassword.submit}
            </Button>
          </form>

          <a href={`/${lang}/login`} className="link-action">
            {dict.forgotPassword.backToLogin}
          </a>
        </div>
      )}
    </AuthLayout>
  );
}
