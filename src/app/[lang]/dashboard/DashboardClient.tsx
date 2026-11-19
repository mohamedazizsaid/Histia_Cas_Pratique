"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

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
    <div className="flex min-h-screen items-center justify-center px-4 py-8">
      <div className="flex w-full max-w-[430px] flex-col items-center gap-5 rounded-2xl border border-white/[0.08] bg-[#18142c]/85 p-8 shadow-[0_25px_60px_rgba(0,0,0,0.65)] backdrop-blur-xl">
        <div className="flex size-16 items-center justify-center rounded-full bg-[#5e4fb0] text-xl font-bold text-white shadow-inner">
          {name.charAt(0).toUpperCase()}
        </div>

        <h1 className="text-xl font-bold tracking-tight text-white">{dict.title}</h1>

        <div className="text-center">
          <p className="text-sm text-white/50">{dict.welcome}</p>
          <p className="mt-1 text-sm font-medium text-primary">{email}</p>
        </div>

        <Button
          variant="primary"
          size="lg"
          alignment="center"
          isLoading={isLoading}
          onClick={handleSignOut}
          className="mt-4 h-11 w-full rounded-lg text-sm font-medium"
        >
          {dict.signOut}
        </Button>
      </div>
    </div>
  );
}
