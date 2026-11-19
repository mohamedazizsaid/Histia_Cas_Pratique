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
        <div className="flex flex-col items-center">
          <h1 className="mb-2 text-center text-xl font-bold tracking-tight text-white">
            {dict.resetPassword.title}
          </h1>
          <p className="mb-6 text-center text-xs text-danger">
            {dict.errors.INVALID_TOKEN}
          </p>
          <a
            href={`/${lang}/login`}
            className="text-xs text-white/50 transition-colors hover:text-white/75"
          >
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
        <div className="flex flex-col items-center">
          <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-success-500/20 text-success">
            ✓
          </div>
          <h1 className="mb-2 text-center text-xl font-bold tracking-tight text-white">
            {dict.resetPassword.title}
          </h1>
          <p className="mb-6 text-center text-sm text-white/60">
            {lang === "fr"
              ? "Votre mot de passe a été réinitialisé avec succès."
              : "Your password has been reset successfully."}
          </p>
          <a
            href={`/${lang}/login`}
            className="text-xs text-white/50 transition-colors hover:text-white/75"
          >
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
      <div className="flex flex-col items-center">
        <h1 className="mb-2 text-center text-xl font-bold tracking-tight text-white">
          {dict.resetPassword.title}
        </h1>

        <p className="mb-6 max-w-xs text-center text-sm leading-relaxed text-white/50">
          {dict.resetPassword.description}
        </p>

        {serverError && (
          <div className="mb-4 w-full rounded-lg border border-danger/30 bg-danger/10 px-3.5 py-2.5 text-center text-xs text-danger">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col gap-3.5">
          <PasswordInput
            placeholder={dict.resetPassword.newPassword}
            visibilityLabels={{
              show: dict.auth.showPassword,
              hide: dict.auth.hidePassword,
            }}
            {...register("password")}
            errorMessage={
              errors.password
                ? dict.errors.PASSWORD_TOO_SHORT
                : undefined
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

          <Button
            type="submit"
            variant="primary"
            size="lg"
            alignment="center"
            isLoading={isLoading}
            className="mt-2 h-11 w-full rounded-lg text-sm font-medium"
          >
            {dict.resetPassword.submit}
          </Button>
        </form>

        <a
          href={`/${lang}/login`}
          className="mt-4 text-xs text-white/50 transition-colors hover:text-white/75"
        >
          {dict.resetPassword.backToLogin}
        </a>
      </div>
    </AuthLayout>
  );
}
