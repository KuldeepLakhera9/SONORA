import React from "react";
import Link from "next/link";
import { Music2, ArrowLeft } from "lucide-react";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Recover Password | SONORA",
  description: "Reset your SONORA account password.",
};

export default function ForgotPasswordPage() {
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
          Forgot your password?
        </h1>
        <p className="text-xs sm:text-sm text-[#A1A1AA]">
          Enter your registered email address and we&apos;ll send you instructions to reset your password.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#111116] border border-white/[0.08] shadow-2xl rounded-3xl p-6 sm:p-8 backdrop-blur-xl">
          <ForgotPasswordForm />
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#A1A1AA] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Sign In</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
