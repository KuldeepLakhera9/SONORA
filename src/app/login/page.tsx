import React, { Suspense } from "react";
import Link from "next/link";
import { Music2 } from "lucide-react";
import { LoginForm } from "@/components/auth/login-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | SONORA",
  description: "Sign in to your SONORA account to access your music library, playlists, and recommendations.",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#09090D] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Ambient background glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[550px] h-[550px] bg-purple-600/10 rounded-full blur-[140px]" />
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
          Welcome back
        </h1>
        <p className="text-xs sm:text-sm text-[#A1A1AA]">
          Sign in to continue exploring independent music soundscapes.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#111116] border border-white/[0.08] shadow-2xl rounded-3xl p-6 sm:p-8 backdrop-blur-xl">
          <Suspense fallback={<div className="h-48 flex items-center justify-center text-xs text-[#71717A]">Loading sign in form...</div>}>
            <LoginForm />
          </Suspense>
        </div>

        <p className="mt-6 text-center text-xs text-[#A1A1AA]">
          Don&apos;t have an account yet?{" "}
          <Link
            href="/signup"
            className="font-semibold text-purple-400 hover:text-purple-300 underline underline-offset-4 transition-colors"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
