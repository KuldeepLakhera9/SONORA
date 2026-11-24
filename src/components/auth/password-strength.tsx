"use client";

import React from "react";
import { calculatePasswordStrength } from "@/lib/auth/validation";

interface PasswordStrengthProps {
  password: string;
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  if (!password) return null;

  const { score, label, color } = calculatePasswordStrength(password);

  return (
    <div className="mt-2 space-y-1.5" aria-live="polite">
      <div className="flex items-center justify-between text-xs">
        <span className="text-[#A1A1AA]">Password strength:</span>
        <span
          className={`font-medium ${
            score <= 1
              ? "text-red-400"
              : score === 2
              ? "text-amber-400"
              : score === 3
              ? "text-purple-400"
              : "text-emerald-400"
          }`}
        >
          {label}
        </span>
      </div>

      {/* 4 strength segments */}
      <div className="grid grid-cols-4 gap-1.5 h-1.5">
        {[1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={`rounded-full transition-all duration-300 ${
              score >= level ? color : "bg-white/10"
            }`}
          />
        ))}
      </div>
      <p className="text-[11px] text-[#71717A]">
        Use 8+ characters with letters, numbers, and symbols.
      </p>
    </div>
  );
}
