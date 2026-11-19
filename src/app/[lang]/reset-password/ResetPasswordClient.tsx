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

  // If no token, show error
  if (!token) {
    return (
      <AuthLayout
        lang={lang}
        sectorLabels={dict.sectors}
        statusLabels={dict.companyStatus}
      >
        <div className="flex flex-col items-center gap-6">
          <h2 className="text-center text-m font-semibold">
            {dict.resetPassword.title}
          </h2>
          <p className="text-center text-sx text-danger">
            {dict.errors.INVALID_TOKEN}
          </p>
          <a
            href={`/${lang}/login`}
            className="text-sx text-white/50 transition-colors hover:text-white/70"
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
        <div className="flex flex-col items-center gap-6">
          <h2 className="text-center text-m font-semibold">✓</h2>
          <p className="text-center text-sx text-white/60">
            {lang === "fr"
              ? "Votre mot de passe a été réinitialisé avec succès."
              : "Your password has been reset successfully."}
          </p>
          <a
            href={`/${lang}/login`}
            className="text-sx font-medium text-primary transition-colors hover:text-white"
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
        const code = result.error.code;
        if (code && code in dict.errors) {
          setServerError(dict.errors[code]);
        } else {
          setServerError(result.error.message ?? "An error occurred");
        }
        return;
      }

      setSuccess(true);
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
      <div className="flex flex-col items-center gap-6">
        <h2 className="text-center text-m font-semibold">
          {dict.resetPassword.title}
        </h2>
        <p className="text-center text-sx text-white/60">
          {dict.resetPassword.description}
        </p>

        {serverError && (
          <div className="w-full rounded-sm bg-danger/10 px-4 py-2.5 text-sx text-danger">
            {serverError}
          </div>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex w-full flex-col gap-4"
        >
          <PasswordInput
            label={dict.resetPassword.newPassword}
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
            label={dict.resetPassword.confirmPassword}
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
            textSize="base"
            isLoading={isLoading}
            className="w-full"
          >
            {dict.resetPassword.submit}
          </Button>
        </form>

        <a
          href={`/${lang}/login`}
          className="text-sx text-white/50 transition-colors hover:text-white/70"
        >
          {dict.resetPassword.backToLogin}
        </a>
      </div>
    </AuthLayout>
  );
}
