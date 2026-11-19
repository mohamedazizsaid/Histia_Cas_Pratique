"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { PasswordInput } from "@/components/ui/password-input";
import { Button } from "@/components/ui/button";

interface ResetPasswordClientProps {
  lang: string;
  dict: {
    resetPassword: {
      title: string;
      description: string;
      newPassword: string;
      confirmPassword: string;
      submit: string;
      backToLogin: string;
    };
    auth: { showPassword: string; hidePassword: string };
    errors: Record<string, string>;
    sectors: Record<string, string>;
    companyStatus: Record<string, string>;
  };
}

export function ResetPasswordClient({ lang, dict }: ResetPasswordClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const schema = z
    .object({
      password: z.string().min(8),
      confirmPassword: z.string().min(1),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: dict.errors.PASSWORDS_DO_NOT_MATCH,
      path: ["confirmPassword"],
    });

  type FormData = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  if (!token) {
    return (
      <AuthLayout
        lang={lang}
        sectorLabels={dict.sectors}
        statusLabels={dict.companyStatus}
      >
        <div className="flex w-full flex-col items-center gap-10">
          <h1 className="text-center text-[28px] leading-[34px] font-semibold text-white">
            {dict.resetPassword.title}
          </h1>
          <p className="text-center text-[16px] leading-[24px] font-light text-danger">
            {dict.errors.INVALID_TOKEN}
          </p>
          <a href={`/${lang}/login`} className="link-action">
            {dict.resetPassword.backToLogin}
          </a>
        </div>
      </AuthLayout>
    );
  }

  if (success) {
    return (
      <AuthLayout
        lang={lang}
        sectorLabels={dict.sectors}
        statusLabels={dict.companyStatus}
      >
        <div className="flex w-full flex-col items-center gap-10">
          <div className="flex size-12 items-center justify-center rounded-full bg-success-500/20 text-success">
            ✓
          </div>
          <div className="flex flex-col items-center gap-3 text-center">
            <h1 className="text-[28px] leading-[34px] font-semibold text-white">
              {dict.resetPassword.title}
            </h1>
            <p className="text-[16px] leading-[24px] font-light text-white/80">
              {lang === "fr"
                ? "Votre mot de passe a été réinitialisé avec succès."
                : "Your password has been reset successfully."}
            </p>
          </div>
          <a href={`/${lang}/login`} className="link-action">
            {dict.resetPassword.backToLogin}
          </a>
        </div>
      </AuthLayout>
    );
  }

  const onSubmit = async (data: FormData) => {
    setServerError(null);
    setIsLoading(true);

    try {
      const result = await authClient.resetPassword({
        newPassword: data.password,
        token,
      });

      if (result.error) {
        const errCode = result.error.code;
        if (errCode && errCode in dict.errors) {
          setServerError(dict.errors[errCode]);
        } else {
          setServerError(result.error.message ?? "An error occurred");
        }
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push(`/${lang}/login`);
      }, 2000);
    } catch {
      setServerError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      lang={lang}
      sectorLabels={dict.sectors}
      statusLabels={dict.companyStatus}
    >
      <div className="flex w-full flex-col items-center gap-10">
        <header className="flex flex-col items-center gap-3 text-center">
          <h1 className="text-[28px] leading-[34px] font-semibold text-white">
            {dict.resetPassword.title}
          </h1>
          <p className="max-w-[499px] text-[16px] leading-[24px] font-light text-white/80">
            {dict.resetPassword.description}
          </p>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col gap-8">
          {serverError && (
            <div className="rounded-[8px] border border-danger/30 bg-danger/10 px-4 py-2.5 text-center text-[13px] leading-[18px] text-[#e75261]">
              {serverError}
            </div>
          )}

          <div className="flex w-full flex-col gap-4">
            <PasswordInput
              placeholder={dict.resetPassword.newPassword}
              visibilityLabels={{
                show: dict.auth.showPassword,
                hide: dict.auth.hidePassword,
              }}
              {...register("password")}
              errorMessage={
                errors.password ? dict.errors.PASSWORD_TOO_SHORT : undefined
              }
            />

            <PasswordInput
              placeholder={dict.resetPassword.confirmPassword}
              visibilityLabels={{
                show: dict.auth.showPassword,
                hide: dict.auth.hidePassword,
              }}
              {...register("confirmPassword")}
              errorMessage={errors.confirmPassword?.message}
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            alignment="center"
            isLoading={isLoading}
            className="h-[51px] w-full rounded-[8px] px-5 text-[16px] font-semibold leading-none"
          >
            {dict.resetPassword.submit}
          </Button>
        </form>

        <a href={`/${lang}/login`} className="link-action">
          {dict.resetPassword.backToLogin}
        </a>
      </div>
    </AuthLayout>
  );
}
