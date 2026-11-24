"use client";

import React, { useState, useTransition, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Lock,
  AtSign,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";
import { signUpAction, checkUsernameAvailability } from "@/lib/auth/actions";
import { PasswordStrength } from "./password-strength";

export function SignupForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Username live checking
  const [usernameStatus, setUsernameStatus] = useState<{
    checking: boolean;
    available?: boolean;
    message?: string;
  }>({ checking: false });

  // Form feedback state
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [globalMessage, setGlobalMessage] = useState<{
    type: "error" | "success";
    text: string;
  } | null>(null);

  // Debounced username availability check
  useEffect(() => {
    const clean = username.trim();
    if (clean.length < 3) {
      setUsernameStatus({ checking: false });
      return;
    }

    setUsernameStatus({ checking: true });
    const timer = setTimeout(async () => {
      const result = await checkUsernameAvailability(clean);
      setUsernameStatus({
        checking: false,
        available: result.available,
        message: result.message,
      });
    }, 400);

    return () => clearTimeout(timer);
  }, [username]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setGlobalMessage(null);
    setErrors({});

    if (!acceptTerms) {
      setErrors({ acceptTerms: ["You must accept the terms and privacy policy"] });
      return;
    }

    const formData = new FormData();
    formData.append("displayName", displayName);
    formData.append("username", username);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("confirmPassword", confirmPassword);
    formData.append("acceptTerms", acceptTerms ? "true" : "false");

    startTransition(async () => {
      const result = await signUpAction(formData);

      if (!result.success) {
        setGlobalMessage({ type: "error", text: result.message || "Registration failed." });
        if (result.errors) {
          setErrors(result.errors);
        }
      } else {
        setGlobalMessage({
          type: "success",
          text: result.message || "Registration successful! Please check your email for the confirmation link.",
        });
      }
    });
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Success Notification */}
      {globalMessage?.type === "success" ? (
        <div className="p-6 rounded-2xl bg-gradient-to-b from-purple-900/30 to-[#17171F] border border-purple-500/30 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-purple-500/20 text-purple-400 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white">Check your email</h3>
          <p className="text-sm text-[#A1A1AA] leading-relaxed">
            {globalMessage.text}
          </p>
          <div className="pt-2">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-lg shadow-purple-600/20 transition-all"
            >
              <span>Go to Sign In</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Global Error Banner */}
          {globalMessage?.type === "error" && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{globalMessage.text}</span>
            </div>
          )}

          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-[#A1A1AA]">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717A]" />
              <input
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Elena Rostova"
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#17171F] border text-sm text-[#F5F5F7] placeholder-[#71717A] focus:outline-none transition-colors ${
                  errors.displayName
                    ? "border-red-500/50 focus:border-red-500"
                    : "border-white/10 focus:border-purple-500/80"
                }`}
              />
            </div>
            {errors.displayName && (
              <p className="text-xs text-red-400">{errors.displayName[0]}</p>
            )}
          </div>

          {/* Username */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label className="font-medium text-[#A1A1AA]">Username</label>
              {usernameStatus.checking ? (
                <span className="text-[11px] text-[#71717A] flex items-center gap-1">
                  <Loader2 className="w-3 h-3 animate-spin" /> Checking...
                </span>
              ) : usernameStatus.available === true ? (
                <span className="text-[11px] text-emerald-400 font-medium">Available</span>
              ) : usernameStatus.available === false ? (
                <span className="text-[11px] text-red-400 font-medium">Unavailable</span>
              ) : null}
            </div>
            <div className="relative">
              <AtSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717A]" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="elenarostova"
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#17171F] border text-sm text-[#F5F5F7] placeholder-[#71717A] focus:outline-none transition-colors ${
                  errors.username || usernameStatus.available === false
                    ? "border-red-500/50 focus:border-red-500"
                    : usernameStatus.available === true
                    ? "border-emerald-500/50 focus:border-emerald-500"
                    : "border-white/10 focus:border-purple-500/80"
                }`}
              />
            </div>
            {errors.username && (
              <p className="text-xs text-red-400">{errors.username[0]}</p>
            )}
            {usernameStatus.message && !errors.username && (
              <p className="text-xs text-red-400">{usernameStatus.message}</p>
            )}
          </div>

          {/* Email */}
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
                placeholder="elena@example.com"
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#17171F] border text-sm text-[#F5F5F7] placeholder-[#71717A] focus:outline-none transition-colors ${
                  errors.email
                    ? "border-red-500/50 focus:border-red-500"
                    : "border-white/10 focus:border-purple-500/80"
                }`}
              />
            </div>
            {errors.email && (
              <p className="text-xs text-red-400">{errors.email[0]}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-[#A1A1AA]">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717A]" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className={`w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#17171F] border text-sm text-[#F5F5F7] placeholder-[#71717A] focus:outline-none transition-colors ${
                  errors.password
                    ? "border-red-500/50 focus:border-red-500"
                    : "border-white/10 focus:border-purple-500/80"
                }`}
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
            {errors.password && (
              <p className="text-xs text-red-400">{errors.password[0]}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-[#A1A1AA]">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717A]" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
                className={`w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#17171F] border text-sm text-[#F5F5F7] placeholder-[#71717A] focus:outline-none transition-colors ${
                  errors.confirmPassword
                    ? "border-red-500/50 focus:border-red-500"
                    : "border-white/10 focus:border-purple-500/80"
                }`}
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
            {errors.confirmPassword && (
              <p className="text-xs text-red-400">{errors.confirmPassword[0]}</p>
            )}
          </div>

          {/* Terms Agreement */}
          <div className="pt-1">
            <label className="flex items-start gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="mt-1 w-4 h-4 rounded bg-[#17171F] border-white/20 text-purple-600 focus:ring-purple-500 focus:ring-offset-0 cursor-pointer"
              />
              <span className="text-xs text-[#A1A1AA] leading-relaxed">
                I agree to the{" "}
                <Link href="#" className="text-purple-400 hover:text-purple-300 underline">
                  Terms of Service
                </Link>{" "}
                and acknowledge the{" "}
                <Link href="#" className="text-purple-400 hover:text-purple-300 underline">
                  Privacy Policy
                </Link>
                .
              </span>
            </label>
            {errors.acceptTerms && (
              <p className="text-xs text-red-400 mt-1">{errors.acceptTerms[0]}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isPending || usernameStatus.available === false}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold shadow-lg shadow-purple-600/25 transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              <span>Create Account</span>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
