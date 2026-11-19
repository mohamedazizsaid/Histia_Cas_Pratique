"use client";

import { useState } from "react";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { cn } from "@/lib/utils";

interface LoginPageClientProps {
  lang: string;
  dict: {
    auth: {
      welcomeBack: string;
      welcomeNew: string;
      subtitleLogin: string;
      subtitleRegister: string;
      tabLogin: string;
      tabRegister: string;
      email: string;
      password: string;
      confirmPassword: string;
      signIn: string;
      signUp: string;
      forgotPassword: string;
      terms: string;
      privacy: string;
      showPassword: string;
      hidePassword: string;
    };
    errors: Record<string, string>;
    sectors: Record<string, string>;
    companyStatus: Record<string, string>;
  };
}

export function LoginPageClient({ lang, dict }: LoginPageClientProps) {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  return (
    <AuthLayout
      lang={lang}
      sectorLabels={dict.sectors}
      statusLabels={dict.companyStatus}
    >
      <div className="flex w-full flex-col items-center gap-8">
        {/* Header */}
        <header className="flex flex-col items-center gap-[10px] text-center">
          <h1 className="text-[28px] leading-[34px] font-semibold text-white">
            {activeTab === "login" ? dict.auth.welcomeBack : dict.auth.welcomeNew}
          </h1>
          <p className="text-[16px] leading-[24px] font-light text-white/80">
            {activeTab === "login"
              ? dict.auth.subtitleLogin
              : dict.auth.subtitleRegister}
          </p>
        </header>

        {/* Tabs + form */}
        <div className="flex w-full flex-col items-center gap-8">
          <div className="w-full">
            <div className="flex justify-center gap-12">
              <button
                type="button"
                onClick={() => setActiveTab("login")}
                className={cn(
                  "relative cursor-pointer pb-3 text-[16px] font-semibold leading-[26px] capitalize transition-colors",
                  activeTab === "login"
                    ? "text-[#7e73bf]"
                    : "text-white/80 hover:text-white",
                )}
              >
                {dict.auth.tabLogin}
                {activeTab === "login" && (
                  <span className="absolute inset-x-0 -bottom-px h-[2px] rounded-full bg-[#7e73bf]" />
                )}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("register")}
                className={cn(
                  "relative cursor-pointer pb-3 text-[16px] font-semibold leading-[26px] capitalize transition-colors",
                  activeTab === "register"
                    ? "text-[#7e73bf]"
                    : "text-white/80 hover:text-white",
                )}
              >
                {dict.auth.tabRegister}
                {activeTab === "register" && (
                  <span className="absolute inset-x-0 -bottom-px h-[2px] rounded-full bg-[#7e73bf]" />
                )}
              </button>
            </div>
            <div className="h-px w-full bg-white/10" />
          </div>

          {activeTab === "login" ? (
            <LoginForm
              lang={lang}
              dict={{
                email: dict.auth.email,
                password: dict.auth.password,
                signIn: dict.auth.signIn,
                forgotPassword: dict.auth.forgotPassword,
                showPassword: dict.auth.showPassword,
                hidePassword: dict.auth.hidePassword,
              }}
              errors={dict.errors}
            />
          ) : (
            <RegisterForm
              lang={lang}
              dict={{
                email: dict.auth.email,
                password: dict.auth.password,
                confirmPassword: dict.auth.confirmPassword,
                signUp: dict.auth.signUp,
                showPassword: dict.auth.showPassword,
                hidePassword: dict.auth.hidePassword,
              }}
              errors={dict.errors}
            />
          )}
        </div>

        {/* Legal footer */}
        <footer className="footer-legal flex items-center justify-center gap-[10px] text-white">
          <span className="cursor-pointer transition-colors hover:text-white/80">
            {dict.auth.terms}
          </span>
          <span className="h-[11px] w-px bg-white/50" aria-hidden="true" />
          <span className="cursor-pointer text-[#dfdcef] transition-colors hover:text-white">
            {dict.auth.privacy}
          </span>
        </footer>
      </div>
    </AuthLayout>
  );
}
