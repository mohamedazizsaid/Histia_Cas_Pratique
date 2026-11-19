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
      <div className="mb-6 flex justify-center gap-6 border-b border-white/10">
        <button
          type="button"
          onClick={() => setActiveTab("login")}
          className={cn(
            "cursor-pointer pb-2 text-sx font-medium transition-colors",
            activeTab === "login"
              ? "border-b-2 border-white text-white"
              : "text-white/50 hover:text-white/70",
          )}
        >
          {loginLabel}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("register")}
          className={cn(
            "cursor-pointer pb-2 text-sx font-medium transition-colors",
            activeTab === "register"
              ? "border-b-2 border-white text-white"
              : "text-white/50 hover:text-white/70",
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
