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

interface RegisterFormProps {
  lang: string;
  dict: {
    email: string;
    password: string;
    confirmPassword: string;
    signUp: string;
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
      email: z.string().email(),
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
          errorMessage={errors.password ? errorMessages.PASSWORD_TOO_SHORT : undefined}
        />
      </div>

      {/* Confirm password */}
      <div className="mt-4">
        <PasswordInput
          placeholder={dict.confirmPassword}
          visibilityLabels={{ show: dict.showPassword, hide: dict.hidePassword }}
          {...register("confirmPassword")}
          errorMessage={errors.confirmPassword?.message}
        />
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
        {dict.signUp}
      </Button>
    </form>
  );
}
