import React from "react";
import { Shield, Sparkles, Calendar, Mail } from "lucide-react";
import type { Profile } from "@/types/database.types";

interface ProfileHeaderProps {
  profile: Profile;
  email?: string;
}

export function ProfileHeader({ profile, email }: ProfileHeaderProps) {
  const roleBadgeStyle = {
    listener: "bg-purple-500/15 text-purple-400 border-purple-500/30",
    artist: "bg-indigo-500/15 text-indigo-400 border-indigo-500/30",
    moderator: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    admin: "bg-red-500/15 text-red-400 border-red-500/30",
  }[profile.role];

  const roleLabel = {
    listener: "Listener",
    artist: "Verified Artist",
    moderator: "Curator / Moderator",
    admin: "System Administrator",
  }[profile.role];

  const formattedDate = new Date(profile.created_at).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-[#1E1E28] to-[#111116] border border-white/[0.08] p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {profile.display_name}
            </h1>
            <span
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border uppercase tracking-wider ${roleBadgeStyle}`}
            >
              {roleLabel}
            </span>
          </div>
          <p className="text-sm font-medium text-purple-400/90 mt-0.5">
            @{profile.username}
          </p>
        </div>

        {/* Account Metadata */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-[#A1A1AA]">
          {email && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/30 border border-white/5">
              <Mail className="w-3.5 h-3.5 text-[#71717A]" />
              <span>{email}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/30 border border-white/5">
            <Calendar className="w-3.5 h-3.5 text-[#71717A]" />
            <span>Joined {formattedDate}</span>
          </div>
        </div>
      </div>

      {profile.bio && (
        <p className="mt-4 text-xs sm:text-sm text-[#A1A1AA] max-w-2xl leading-relaxed">
          {profile.bio}
        </p>
      )}
    </div>
  );
}
