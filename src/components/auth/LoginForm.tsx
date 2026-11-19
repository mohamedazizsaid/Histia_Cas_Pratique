"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Button } from "@/components/ui/button";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  lang: string;
  dict: {
    email: string;
    password: string;
    signIn: string;
    forgotPassword: string;
    showPassword: string;
    hidePassword: string;
  };
  errors: Record<string, string>;
}

export function LoginForm({ lang, dict, errors: errorMessages }: LoginFormProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setServerError(null);
    setIsLoading(true);

    try {
      const result = await authClient.signIn.email({
        email: data.email,
        password: data.password,
      });

      if (result.error) {
        const code = result.error.code;
        if (code && code in errorMessages) {
          setServerError(errorMessages[code]);
        } else if (result.error.status === 429) {
          setServerError(
            errorMessages.TOO_MANY_REQUESTS?.replace("{seconds}", "10") ??
              "Too many requests",
          );
        } else {
          setServerError(result.error.message ?? "An error occurred");
        }
        return;
      }

      // Check if 2FA is required
      if (result.data && "twoFactorRedirect" in result.data && result.data.twoFactorRedirect) {
        const methods = (result.data as { twoFactorMethods?: string[] }).twoFactorMethods ?? [];
        router.push(`/${lang}/verify?methods=${methods.join(",")}`);
        return;
      }

      // Successfully signed in
      router.push(`/${lang}/dashboard`);
    } catch {
      setServerError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col">
      {serverError && (
        <div className="mb-4 rounded-[8px] border border-danger/30 bg-danger/10 px-4 py-2.5 text-center text-[13px] leading-[18px] text-[#e75261]">
          {serverError}
        </div>
      )}

      {/* Email */}
      <div>
        <Input
          type="email"
          placeholder={dict.email}
          {...register("email")}
          isError={!!errors.email}
        />
        {errors.email && (
          <p className="mt-1 text-[12px] text-danger">{errorMessages.INVALID_EMAIL}</p>
        )}
      </div>

      {/* Password */}
      <div className="mt-4">
        <PasswordInput
          placeholder={dict.password}
          visibilityLabels={{ show: dict.showPassword, hide: dict.hidePassword }}
          {...register("password")}
          errorMessage={errors.password ? errorMessages.REQUIRED_FIELD : undefined}
        />
      </div>

      {/* Forgot password */}
      <div className="mt-8 flex justify-between">
        <a href={`/${lang}/forgot-password`} className="link-action">
          {dict.forgotPassword}
        </a>
        <span className="size-3" aria-hidden="true" />
      </div>

      {/* Submit button */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        alignment="center"
        isLoading={isLoading}
        className="mt-8 h-[51px] w-full rounded-[8px] px-5 text-[16px] font-semibold leading-none"
      >
        {dict.signIn}
      </Button>
    </form>
  );
}
