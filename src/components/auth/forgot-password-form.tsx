"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { Mail, AlertCircle, CheckCircle2, Loader2, ArrowLeft } from "lucide-react";
import { forgotPasswordAction } from "@/lib/auth/actions";

export function ForgotPasswordForm() {
  const [isPending, startTransition] = useTransition();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<{
    type: "error" | "success";
    message: string;
  } | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus(null);

    const formData = new FormData();
    formData.append("email", email);

    startTransition(async () => {
      const result = await forgotPasswordAction(formData);
      if (result.success) {
        setStatus({
          type: "success",
          message:
            result.message ||
            "If an account exists with this email address, a password recovery link has been sent.",
        });
      } else {
        setStatus({
          type: "error",
          message: result.message || "Failed to process recovery request.",
        });
      }
    });
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      {status?.type === "success" ? (
        <div className="p-6 rounded-2xl bg-[#17171F] border border-purple-500/30 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-purple-500/20 text-purple-400 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Recovery link sent</h3>
          <p className="text-xs text-[#A1A1AA] leading-relaxed">
            {status.message}
          </p>
          <div className="pt-2">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-400 hover:text-purple-300"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Sign In</span>
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {status?.type === "error" && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{status.message}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-[#A1A1AA]">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717A]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#17171F] border border-white/10 text-sm text-[#F5F5F7] placeholder-[#71717A] focus:outline-none focus:border-purple-500/80 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white text-sm font-semibold shadow-lg shadow-purple-600/25 transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Sending Recovery Email...</span>
              </>
            ) : (
              <span>Send Recovery Link</span>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
