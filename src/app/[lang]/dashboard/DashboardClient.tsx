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
    <div className="flex min-h-screen items-center justify-center">
      <div className="glassmorphism flex w-full max-w-[28rem] flex-col items-center gap-6 rounded-l p-8">
        <div className="flex size-16 items-center justify-center rounded-full bg-primary-400 text-m font-bold text-white">
          {name.charAt(0).toUpperCase()}
        </div>

        <h1 className="text-m font-semibold">{dict.title}</h1>

        <p className="text-center text-sx text-white/60">
          {dict.welcome}
        </p>
        <p className="text-s font-medium text-primary">{email}</p>

        <Button
          variant="primary"
          size="lg"
          alignment="center"
          textSize="base"
          isLoading={isLoading}
          onClick={handleSignOut}
          className="mt-4 w-full"
        >
          {dict.signOut}
        </Button>
      </div>
    </div>
  );
}
