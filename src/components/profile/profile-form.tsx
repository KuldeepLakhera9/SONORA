"use client";

import React, { useState, useTransition } from "react";
import { User, AtSign, FileText, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { updateProfileAction } from "@/lib/auth/actions";
import type { Profile } from "@/types/database.types";

interface ProfileFormProps {
  profile: Profile;
  email?: string;
}

export function ProfileForm({ profile, email }: ProfileFormProps) {
  const [isPending, startTransition] = useTransition();
  const [displayName, setDisplayName] = useState(profile.display_name);
  const [username, setUsername] = useState(profile.username);
  const [bio, setBio] = useState(profile.bio || "");

  const [message, setMessage] = useState<{
    type: "error" | "success";
    text: string;
  } | null>(null);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);
    setErrors({});

    const formData = new FormData();
    formData.append("displayName", displayName);
    formData.append("username", username);
    formData.append("bio", bio);

    startTransition(async () => {
      const result = await updateProfileAction(formData);
      if (result.success) {
        setMessage({
          type: "success",
          text: result.message || "Profile updated successfully!",
        });
      } else {
        setMessage({
          type: "error",
          text: result.message || "Failed to update profile.",
        });
        if (result.errors) {
          setErrors(result.errors);
        }
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {message && (
        <div
          className={`p-4 rounded-xl text-xs flex items-start gap-3 border ${
            message.type === "error"
              ? "bg-red-500/10 border-red-500/20 text-red-300"
              : "bg-emerald-500/10 border-emerald-500/20 text-emerald-300"
          }`}
        >
          {message.type === "error" ? (
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Display Name */}
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-[#A1A1AA]">
            Display Name
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717A]" />
            <input
              type="text"
              required
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#17171F] border border-white/10 text-sm text-[#F5F5F7] placeholder-[#71717A] focus:outline-none focus:border-purple-500/80 transition-colors"
            />
          </div>
          {errors.displayName && (
            <p className="text-xs text-red-400">{errors.displayName[0]}</p>
          )}
        </div>

        {/* Username */}
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-[#A1A1AA]">
            Username
          </label>
          <div className="relative">
            <AtSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717A]" />
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#17171F] border border-white/10 text-sm text-[#F5F5F7] placeholder-[#71717A] focus:outline-none focus:border-purple-500/80 transition-colors"
            />
          </div>
          {errors.username && (
            <p className="text-xs text-red-400">{errors.username[0]}</p>
          )}
        </div>
      </div>

      {/* Email (Read-only notice) */}
      <div className="space-y-1.5">
        <label className="block text-xs font-medium text-[#A1A1AA]">
          Registered Email Address
        </label>
        <input
          type="email"
          disabled
          value={email || "No verified email associated"}
          className="w-full px-4 py-2.5 rounded-xl bg-[#17171F]/50 border border-white/5 text-sm text-[#71717A] cursor-not-allowed"
        />
        <p className="text-[11px] text-[#71717A]">
          To change your email address, Supabase sends verification links to both current and new addresses.
        </p>
      </div>

      {/* Bio */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <label className="font-medium text-[#A1A1AA]">Bio</label>
          <span className="text-[11px] text-[#71717A]">{bio.length}/500</span>
        </div>
        <textarea
          rows={3}
          maxLength={500}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Tell other listeners and artists about your musical tastes and interests..."
          className="w-full px-4 py-2.5 rounded-xl bg-[#17171F] border border-white/10 text-sm text-[#F5F5F7] placeholder-[#71717A] focus:outline-none focus:border-purple-500/80 transition-colors resize-none"
        />
        {errors.bio && <p className="text-xs text-red-400">{errors.bio[0]}</p>}
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="py-2.5 px-6 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-lg shadow-purple-600/20 transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50"
        >
          {isPending ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Saving Changes...</span>
            </>
          ) : (
            <span>Save Profile</span>
          )}
        </button>
      </div>
    </form>
  );
}
