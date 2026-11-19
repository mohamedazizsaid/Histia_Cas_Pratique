"use client";

import { useState } from "react";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { AuthTabs } from "@/components/auth/AuthTabs";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";

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
      <h1 className="mb-1 text-center text-m font-semibold">
        {activeTab === "login" ? dict.auth.welcomeBack : dict.auth.welcomeNew}
      </h1>
      <p className="mb-6 text-center text-sx text-white/60">
        {activeTab === "login"
          ? dict.auth.subtitleLogin
          : dict.auth.subtitleRegister}
      </p>

      {/* Tabs */}
      <div className="mb-6 flex justify-center gap-6 border-b border-white/10">
        <button
          type="button"
          onClick={() => setActiveTab("login")}
          className={`cursor-pointer pb-2 text-sx font-medium transition-colors ${
            activeTab === "login"
              ? "border-b-2 border-white text-white"
              : "text-white/50 hover:text-white/70"
          }`}
        >
          {dict.auth.tabLogin}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("register")}
          className={`cursor-pointer pb-2 text-sx font-medium transition-colors ${
            activeTab === "register"
              ? "border-b-2 border-white text-white"
              : "text-white/50 hover:text-white/70"
          }`}
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
