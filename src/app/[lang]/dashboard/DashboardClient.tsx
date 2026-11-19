"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { StolosLogo } from "@/components/layout/StolosLogo";

interface DashboardClientProps {
  lang: string;
  dict: {
    title: string;
    welcome: string;
    signOut: string;
  };
  email: string;
  name: string;
}

export function DashboardClient({
  lang,
  dict,
  email,
  name,
}: DashboardClientProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await authClient.signOut();
      router.push(`/${lang}/login`);
    } catch {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-background relative flex min-h-screen w-full items-center justify-center overflow-x-hidden px-4 py-10">
      <div className="relative z-10 flex w-full max-w-[595px] flex-col items-center gap-10">
        <StolosLogo
          className="w-auto shrink-0"
          style={{ height: "clamp(104px, 13.6vh, 147px)" }}
        />

        <div className="auth-card w-full rounded-[12px] border border-white/[0.06] p-8 sm:p-12">
          <div className="flex flex-col items-center gap-8">
            <h1 className="text-center text-[28px] leading-[34px] font-semibold text-white">
              {dict.title}
            </h1>

            <div className="flex size-16 items-center justify-center rounded-full bg-[#5e4fb0] text-[24px] font-semibold text-white/90 shadow-inner">
              {(name || email).charAt(0).toUpperCase()}
            </div>

            <div className="flex flex-col items-center gap-1 text-center">
              <p className="text-[16px] leading-[24px] font-light text-white/80">
                {dict.welcome}
              </p>
              <p className="text-[16px] leading-[24px] font-medium text-[#9e96cf]">
                {email}
              </p>
            </div>

            <Button
              variant="primary"
              size="lg"
              alignment="center"
              isLoading={isLoading}
              onClick={handleSignOut}
              className="h-[51px] w-full rounded-[8px] px-5 text-[16px] font-semibold leading-none"
            >
              {dict.signOut}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
