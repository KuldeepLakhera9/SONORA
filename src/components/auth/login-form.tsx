"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Mail, Lock, AlertCircle, Loader2, Eye, EyeOff } from "lucide-react";
import { loginAction } from "@/lib/auth/actions";

export function LoginForm() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/home";

  const [isPending, startTransition] = useTransition();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    formData.append("rememberMe", rememberMe ? "on" : "off");
    formData.append("redirectTo", redirectTo);

    startTransition(async () => {
      const result = await loginAction(formData);
      if (result && !result.success) {
        setErrorMessage(result.message || "Invalid credentials.");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {/* Error Alert */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Email Field */}
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
            placeholder="listener@sonora.internal"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#17171F] border border-white/10 text-sm text-[#F5F5F7] placeholder-[#71717A] focus:outline-none focus:border-purple-500/80 transition-colors"
          />
        </div>
      </div>

      {/* Password Field */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <label className="font-medium text-[#A1A1AA]">Password</label>
          <Link
            href="/forgot-password"
            className="text-purple-400 hover:text-purple-300 transition-colors"
          >
            Forgot password?
          </Link>
        </div>
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
      </div>

      {/* Remember Me */}
      <div className="flex items-center justify-between pt-1">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-4 h-4 rounded bg-[#17171F] border-white/20 text-purple-600 focus:ring-purple-500 focus:ring-offset-0 cursor-pointer"
          />
          <span className="text-xs text-[#A1A1AA]">Remember me for 30 days</span>
        </label>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isPending}
        className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white text-sm font-semibold shadow-lg shadow-purple-600/25 transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
      >
        {isPending ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Signing in...</span>
          </>
        ) : (
          <span>Sign In</span>
        )}
      </button>
    </form>
  );
}
