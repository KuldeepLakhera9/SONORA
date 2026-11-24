"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { Lock, AlertCircle, CheckCircle2, Loader2, Eye, EyeOff, ArrowRight } from "lucide-react";
import { resetPasswordAction } from "@/lib/auth/actions";
import { PasswordStrength } from "./password-strength";

export function ResetPasswordForm() {
  const [isPending, startTransition] = useTransition();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [status, setStatus] = useState<{
    type: "error" | "success";
    message: string;
  } | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus(null);

    const formData = new FormData();
    formData.append("password", password);
    formData.append("confirmPassword", confirmPassword);

    startTransition(async () => {
      const result = await resetPasswordAction(formData);
      if (result.success) {
        setStatus({
          type: "success",
          message: result.message || "Your password has been successfully updated.",
        });
      } else {
        setStatus({
          type: "error",
          message: result.message || "Failed to reset password. Recovery link may have expired.",
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
          <h3 className="text-lg font-bold text-white">Password Updated</h3>
          <p className="text-xs text-[#A1A1AA] leading-relaxed">
            {status.message}
          </p>
          <div className="pt-2">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-lg shadow-purple-600/20 transition-all"
            >
              <span>Sign In with New Password</span>
              <ArrowRight className="w-3.5 h-3.5" />
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

          {/* New Password */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-[#A1A1AA]">
              New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717A]" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#17171F] border border-white/10 text-sm text-[#F5F5F7] placeholder-[#71717A] focus:outline-none focus:border-purple-500/80 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#71717A] hover:text-[#A1A1AA]"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <PasswordStrength password={password} />
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-[#A1A1AA]">
              Confirm New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717A]" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#17171F] border border-white/10 text-sm text-[#F5F5F7] placeholder-[#71717A] focus:outline-none focus:border-purple-500/80 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#71717A] hover:text-[#A1A1AA]"
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
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
                <span>Updating Password...</span>
              </>
            ) : (
              <span>Reset Password</span>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
