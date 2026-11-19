"use client";

import { useForm } from "react-hook-form";
import { z } from "zod/v4";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Button } from "@/components/ui/button";

interface RegisterFormProps {
  lang: string;
  dict: {
    email: string;
    password: string;
    confirmPassword: string;
    signUp: string;
    terms: string;
    privacy: string;
    showPassword: string;
    hidePassword: string;
  };
  errors: Record<string, string>;
}

export function RegisterForm({ lang, dict, errors: errorMessages }: RegisterFormProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const registerSchema = z
    .object({
      email: z.email(),
      password: z.string().min(8),
      confirmPassword: z.string().min(1),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: errorMessages.PASSWORDS_DO_NOT_MATCH,
      path: ["confirmPassword"],
    });

  type RegisterFormData = z.infer<typeof registerSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setServerError(null);
    setIsLoading(true);

    try {
      const result = await authClient.signUp.email({
        name: data.email.split("@")[0],
        email: data.email,
        password: data.password,
      });

      if (result.error) {
        const code = result.error.code;
        if (code && code in errorMessages) {
          setServerError(errorMessages[code]);
        } else {
          setServerError(result.error.message ?? "An error occurred");
        }
        return;
      }

      // Sign-up auto-signs-in → go to dashboard
      router.push(`/${lang}/dashboard`);
    } catch {
      setServerError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      {/* Server error */}
      {serverError && (
        <div className="rounded-sm bg-danger/10 px-4 py-2.5 text-sx text-danger">
          {serverError}
        </div>
      )}

      {/* Email */}
      <Input
        type="email"
        placeholder={dict.email}
        className="rounded-sm border border-white/40 bg-black/10 px-4 py-2.5"
        inputClassName="h-7 text-lg placeholder:text-white/40"
        {...register("email")}
        aria-invalid={!!errors.email}
      />
      {errors.email && (
        <p className="text-xs text-danger">{errorMessages.INVALID_EMAIL}</p>
      )}

      {/* Password */}
      <PasswordInput
        label={dict.password}
        visibilityLabels={{ show: dict.showPassword, hide: dict.hidePassword }}
        {...register("password")}
        errorMessage={
          errors.password ? errorMessages.PASSWORD_TOO_SHORT : undefined
        }
      />

      {/* Confirm password */}
      <PasswordInput
        label={dict.confirmPassword}
        visibilityLabels={{ show: dict.showPassword, hide: dict.hidePassword }}
        {...register("confirmPassword")}
        errorMessage={errors.confirmPassword?.message}
      />

      {/* Submit */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        alignment="center"
        textSize="base"
        isLoading={isLoading}
        className="mt-2 w-full"
      >
        {dict.signUp}
      </Button>

      {/* Footer */}
      <div className="mt-2 flex justify-center gap-2 text-xs text-white/40">
        <span className="cursor-pointer hover:text-white/60">{dict.terms}</span>
        <span>|</span>
        <span className="cursor-pointer hover:text-white/60">{dict.privacy}</span>
      </div>
    </form>
  );
}
