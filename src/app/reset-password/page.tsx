import React, { Suspense } from "react";
import Link from "next/link";
import { Music2 } from "lucide-react";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Set New Password | SONORA",
  description: "Set a new password for your SONORA account.",
};

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-[#09090D] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[140px]" />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <Link href="/" className="inline-flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-600/30 group-hover:scale-105 transition-transform">
            <Music2 className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-black tracking-wider text-white font-mono">
            SONORA
          </span>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F5F5F7] tracking-tight">
          Create new password
        </h1>
        <p className="text-xs sm:text-sm text-[#A1A1AA]">
          Ensure your new password is at least 8 characters and includes numbers or symbols.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#111116] border border-white/[0.08] shadow-2xl rounded-3xl p-6 sm:p-8 backdrop-blur-xl">
          <Suspense fallback={<div className="h-48 flex items-center justify-center text-xs text-[#71717A]">Loading reset form...</div>}>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
