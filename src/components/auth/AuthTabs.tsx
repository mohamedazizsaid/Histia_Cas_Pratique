"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface AuthTabsProps {
  loginLabel: string;
  registerLabel: string;
  loginContent: React.ReactNode;
  registerContent: React.ReactNode;
}

export function AuthTabs({
  loginLabel,
  registerLabel,
  loginContent,
  registerContent,
}: AuthTabsProps) {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  return (
    <div className="flex flex-col">
      {/* Tabs */}
      <div className="mb-6 flex justify-center gap-8 border-b border-white/10">
        <button
          type="button"
          onClick={() => setActiveTab("login")}
          className={cn(
            "cursor-pointer pb-2.5 text-sm transition-colors -mb-[1px]",
            activeTab === "login"
              ? "border-b-2 border-[#7e73bf] font-medium text-white"
              : "font-normal text-white/50 hover:text-white/75",
          )}
        >
          {loginLabel}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("register")}
          className={cn(
            "cursor-pointer pb-2.5 text-sm transition-colors -mb-[1px]",
            activeTab === "register"
              ? "border-b-2 border-[#7e73bf] font-medium text-white"
              : "font-normal text-white/50 hover:text-white/75",
          )}
        >
          {registerLabel}
        </button>
      </div>

      {/* Content */}
      {activeTab === "login" ? loginContent : registerContent}
    </div>
  );
}
