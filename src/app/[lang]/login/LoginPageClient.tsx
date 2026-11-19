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
      {/* Title */}
      <h1 className="mb-1 text-center text-[19px] font-semibold text-white">
        {activeTab === "login" ? dict.auth.welcomeBack : dict.auth.welcomeNew}
      </h1>
      <p className="mb-6 text-center text-[13px] text-white/50 leading-relaxed">
        {activeTab === "login"
          ? dict.auth.subtitleLogin
          : dict.auth.subtitleRegister}
      </p>

      {/* Tabs matching Figma Images 7 & 8 */}
      <div className="mb-6 flex justify-center gap-8 border-b border-white/10">
        <button
          type="button"
          onClick={() => setActiveTab("login")}
          className={cn(
            "cursor-pointer pb-2.5 text-sm transition-colors -mb-[1px]",
            activeTab === "login"
              ? "border-b-2 border-[#7e73bf] font-medium text-white"
              : "font-normal text-white/50 hover:text-white/75",
          )}
        >
          {dict.auth.tabLogin}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("register")}
          className={cn(
            "cursor-pointer pb-2.5 text-sm transition-colors -mb-[1px]",
            activeTab === "register"
              ? "border-b-2 border-[#7e73bf] font-medium text-white"
              : "font-normal text-white/50 hover:text-white/75",
          )}
        >
          {dict.auth.tabRegister}
        </button>
      </div>

      {/* Forms */}
      {activeTab === "login" ? (
        <LoginForm
          lang={lang}
          dict={{
            email: dict.auth.email,
            password: dict.auth.password,
            signIn: dict.auth.signIn,
            forgotPassword: dict.auth.forgotPassword,
            terms: dict.auth.terms,
            privacy: dict.auth.privacy,
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
            terms: dict.auth.terms,
            privacy: dict.auth.privacy,
            showPassword: dict.auth.showPassword,
            hidePassword: dict.auth.hidePassword,
          }}
          errors={dict.errors}
        />
      )}
    </AuthLayout>
  );
}
