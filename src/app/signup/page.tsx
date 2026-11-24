import React from "react";
import Link from "next/link";
import { Music2, Sparkles, ShieldCheck, Headphones, Disc3 } from "lucide-react";
import { SignupForm } from "@/components/auth/signup-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Your Account | SONORA",
  description: "Join SONORA to discover independent artists, personalized soundscapes, and high-fidelity audio.",
};

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-[#09090D] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Decorative ambient background glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        {/* Brand Header */}
        <Link href="/" className="inline-flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-600/30 group-hover:scale-105 transition-transform">
            <Music2 className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-black tracking-wider text-white font-mono">
            SONORA
          </span>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F5F5F7] tracking-tight">
          Discover music. Discover yourself.
        </h1>
        <p className="text-xs sm:text-sm text-[#A1A1AA]">
          Create your account to unlock personalized curation and support independent creators.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="bg-[#111116] border border-white/[0.08] shadow-2xl rounded-3xl p-6 sm:p-10 backdrop-blur-xl">
          <SignupForm />

          {/* Value props badge strip */}
          <div className="mt-6 pt-6 border-t border-white/5 grid grid-cols-3 gap-2 text-center">
            <div className="space-y-1">
              <Sparkles className="w-4 h-4 text-purple-400 mx-auto" />
              <p className="text-[11px] text-[#71717A]">Curated Sounds</p>
            </div>
            <div className="space-y-1">
              <ShieldCheck className="w-4 h-4 text-indigo-400 mx-auto" />
              <p className="text-[11px] text-[#71717A]">Verified Rights</p>
            </div>
            <div className="space-y-1">
              <Headphones className="w-4 h-4 text-purple-300 mx-auto" />
              <p className="text-[11px] text-[#71717A]">Pure Listening</p>
            </div>
          </div>
        </div>

        {/* Footer Link */}
        <p className="mt-6 text-center text-xs text-[#A1A1AA]">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-purple-400 hover:text-purple-300 underline underline-offset-4 transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
