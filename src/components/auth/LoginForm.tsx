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
    terms: string;
    privacy: string;
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
          setServerError(errorMessages.TOO_MANY_REQUESTS?.replace("{seconds}", "10") ?? "Too many requests");
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
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3.5">
      {/* Server error */}
      {serverError && (
        <div className="rounded-lg border border-danger/30 bg-danger/10 px-3.5 py-2.5 text-center text-xs text-danger">
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
          <p className="mt-1 text-xs text-danger">{errorMessages.INVALID_EMAIL}</p>
        )}
      </div>

      {/* Password */}
      <PasswordInput
        placeholder={dict.password}
        visibilityLabels={{ show: dict.showPassword, hide: dict.hidePassword }}
        {...register("password")}
        errorMessage={errors.password ? errorMessages.REQUIRED_FIELD : undefined}
      />

      {/* Forgot password — aligned left to match Figma */}
      <div className="flex justify-start pt-0.5">
        <a
          href={`/${lang}/forgot-password`}
          className="text-[12.5px] text-white/50 transition-colors hover:text-white/75"
        >
          {dict.forgotPassword}
        </a>
      </div>

      {/* Submit button */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        alignment="center"
        isLoading={isLoading}
        className="mt-2 h-11 w-full rounded-lg text-[14.5px] font-medium"
      >
        {dict.signIn}
      </Button>

      {/* Footer */}
      <div className="mt-5 flex items-center justify-center gap-2 text-xs text-white/40">
        <span className="cursor-pointer transition-colors hover:text-white/60">{dict.terms}</span>
        <span>|</span>
        <span className="cursor-pointer transition-colors hover:text-white/60">{dict.privacy}</span>
      </div>
    </form>
  );
}
