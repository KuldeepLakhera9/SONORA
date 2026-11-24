import React from "react";
import { getCurrentUser, getCurrentProfile } from "@/lib/auth/authorization";
import { ProfileHeader } from "@/components/profile/profile-header";
import { ProfileForm } from "@/components/profile/profile-form";
import { AvatarUpload } from "@/components/profile/avatar-upload";
import type { Profile } from "@/types/database.types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Profile | SONORA",
  description: "Manage your SONORA profile, avatar, and personal account preferences.",
};

// Fallback preview profile for local development without live auth
const fallbackProfile: Profile = {
  id: "00000000-0000-4000-a000-000000000005",
  username: "maya_sound",
  display_name: "Maya Chen",
  avatar_path: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
  bio: "Acoustic explorer, ambient sound design enthusiast, and indie music curator based in Seattle.",
  role: "listener",
  is_active: true,
  created_at: "2025-01-10T12:00:00Z",
  updated_at: "2025-01-10T12:00:00Z",
};

export default async function ProfilePage() {
  const user = await getCurrentUser();
  const profile = (await getCurrentProfile()) || fallbackProfile;
  const email = user?.email || "maya@sonora.internal";

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-4xl mx-auto pb-32">
      {/* Profile Header Summary */}
      <ProfileHeader profile={profile} email={email} />

      {/* Avatar & Photo Upload Section */}
      <section className="bg-[#111116] border border-white/[0.08] rounded-3xl p-6 sm:p-8 shadow-xl">
        <h3 className="text-base font-bold text-white mb-6">Profile Picture</h3>
        <AvatarUpload
          userId={profile.id}
          currentAvatarUrl={profile.avatar_path}
          displayName={profile.display_name}
        />
      </section>

      {/* Editable Account Information */}
      <section className="bg-[#111116] border border-white/[0.08] rounded-3xl p-6 sm:p-8 shadow-xl">
        <h3 className="text-base font-bold text-white mb-6">Account Details</h3>
        <ProfileForm profile={profile} email={email} />
      </section>
    </div>
  );
}
